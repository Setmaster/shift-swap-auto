using AuctionService.Data;
using AuctionService.DTOs;
using AuctionService.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuctionService.Controllers;

[ApiController]
[Route("api/auctions")]
public class AuctionsController : ControllerBase
{
    private readonly AuctionDbContext _context; // Variable for database context
    private readonly IMapper _mapper; // Variable for AutoMapper

    // Constructor to initialize the database context and AutoMapper
    public AuctionsController(AuctionDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<List<AuctionDto>>> GetAllAuctions()
    {
        // Fetching all auctions from the database, including related items, and ordering by item make
        var auctions = await _context.Auctions
            .Include(x =>
                x.Item) // This tells EF Core to include the related Item entity when querying the Auctions table, eager loading. Without this, the Item properties would not be loaded automatically (lazy loading) and would require a separate query to access 
            .OrderBy(x => x.Item.Make)
            .ToListAsync();

        // Mapping the list of auctions to a list of AuctionDto objects and returning it
        return _mapper.Map<List<AuctionDto>>(auctions);
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

        var result = await _context.SaveChangesAsync() > 0;

        if (!result)
        {
            return BadRequest("Could not save changes to the DB");
        }

        // Mapping the auction to an AuctionDto object and returning it 
        return CreatedAtAction(nameof(GetAuctionById), new { auction.Id }, _mapper.Map<AuctionDto>(auction));
    }
}