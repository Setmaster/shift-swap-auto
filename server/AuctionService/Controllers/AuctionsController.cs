using AuctionService.Data;
using AuctionService.DTOs;
using AuctionService.Entities;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Contracts;
using MassTransit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuctionService.Controllers;

[ApiController]
[Route("api/auctions")]
public class AuctionsController : ControllerBase
{
    private readonly AuctionDbContext _context; // Variable for database context
    private readonly IMapper _mapper; // Variable for AutoMapper
    private readonly IPublishEndpoint _publishEndpoint;

    // Constructor to initialize the database context and AutoMapper
    public AuctionsController(AuctionDbContext context, IMapper mapper, IPublishEndpoint publishEndpoint)
    {
        _context = context;
        _mapper = mapper;
        _publishEndpoint = publishEndpoint;
    }

    [HttpGet]
    public async Task<ActionResult<List<AuctionDto>>> GetAllAuctions(string date)
    {
        // Create an IQueryable collection of Auctions, ordered by the 'Make' of the item
        var query = _context.Auctions.OrderBy(x => x.Item.Make).AsQueryable();

        // Check if the 'date' string is not null or empty
        if (!string.IsNullOrEmpty(date))
        {
            // Parse the 'date' string into a DateTime object, convert it to UTC, and filter the query
            // to include only those auctions that were updated after the specified date
            query = query.Where(x => x.UpdatedAt.CompareTo(DateTime.Parse(date).ToUniversalTime()) > 0);
        }

        // Projecting the query to an AuctionDto object and returning it as a list
        return await query.ProjectTo<AuctionDto>(_mapper.ConfigurationProvider).ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AuctionDto>> GetAuctionById(Guid id)
    {
        // Fetching a single auction by its ID, including related items
        var auction = await _context.Auctions
            .Include(x => x.Item)
            .FirstOrDefaultAsync(x => x.Id == id);

        // If no auction is found, return a 404 Not Found response
        if (auction == null)
        {
            return NotFound();
        }

        // Mapping the auction to an AuctionDto object and returning it
        return _mapper.Map<AuctionDto>(auction);
    }

    [HttpPost]
    public async Task<ActionResult<AuctionDto>> CreateAuction(CreateAuctionDto auctionDto)
    {
        // Mapping the auctionDto object to an Auction object
        var auction = _mapper.Map<Auction>(auctionDto);

        // TODO: add current user as seller
        auction.Seller = "test";

        // Adding the auction to the database
        _context.Auctions.Add(auction);

        // Mapping the newly created auction to an AuctionDto
        var newAuction = _mapper.Map<AuctionDto>(auction);

        // Publishing an event that a new auction was created
        await _publishEndpoint.Publish(_mapper.Map<AuctionCreated>(newAuction));

        
        var result = await _context.SaveChangesAsync() > 0;
        
        if (!result)
        {
            return BadRequest("Could not save changes to the DB");
        }

        // Returning a 201 Created response with the newly created auction and provides the URL where the newly created resource can be accessed
        return CreatedAtAction(nameof(GetAuctionById), new { auction.Id }, newAuction);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateAuction(Guid id, UpdateAuctionDto updateAuctionDto)
    {
        // Fetching the auction by its ID
        var auction = await _context.Auctions
            .Include(x => x.Item)
            .FirstOrDefaultAsync(x => x.Id == id);

        // If no auction is found, return a 404 Not Found response
        if (auction == null)
        {
            return NotFound();
        }

        // TODO: check seller is current user

        // Updating the auction with the values from the updateAuctionDto
        auction.Item.Make = updateAuctionDto.Make ?? auction.Item.Make;
        auction.Item.Model = updateAuctionDto.Model ?? auction.Item.Model;
        auction.Item.Color = updateAuctionDto.Color ?? auction.Item.Color;
        auction.Item.Mileage = updateAuctionDto.Mileage ?? auction.Item.Mileage;
        auction.Item.Year = updateAuctionDto.Year ?? auction.Item.Year;

        var result = await _context.SaveChangesAsync() > 0;

        if (result) BadRequest("Could not save changes to the DB");

        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteAuction(Guid id)
    {
        // Fetching the auction by its ID
        var auction = await _context.Auctions.FindAsync(id);

        // If no auction is found, return a 404 Not Found response
        if (auction == null)
        {
            return NotFound();
        }

        // TODO: check seller is current user

        // Removing the auction from the database
        _context.Auctions.Remove(auction);

        var result = await _context.SaveChangesAsync() > 0;

        if (!result) return BadRequest("Could not save changes to the DB");

        return Ok();
    }
}