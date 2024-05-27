using Microsoft.AspNetCore.Mvc;
using MongoDB.Entities;
using SearchService.Models;
using SearchService.RequestHelpers;

namespace SearchService.Controllers
{
    [ApiController]
    [Route("api/search")]
    public class SearchController : ControllerBase
    {
        [HttpGet]
        // FromQuery attribute is used to bind the search parameters from the query string
        public async Task<ActionResult<List<Item>>> SearchItems([FromQuery]SearchParams searchParams)
        {
            // Deconstruct the searchParams
            var (searchTerm, pageNumber, pageSize, seller, winner, orderBy, filterBy) = searchParams;
            
            // Create a paged search query for the 'Item' collection
            // Using <Item, Item> to comply with the library's design, allowing different types for the entity and result
            var query = DB.PagedSearch<Item, Item>();

            // If a search term is provided, add a full text search filter and sort by text score
            if (!string.IsNullOrEmpty(searchTerm))
            {
                query.Match(Search.Full, searchTerm).SortByTextScore();
            }
            
            // Apply sorting based on the 'orderBy' parameter
            query = orderBy switch
            {
                // Sort by 'Make' in ascending order
                "make" => query.Sort(x => x.Ascending(a => a.Make)),
                // Sort by 'CreatedAt' in descending order (newest first)
                "new" => query.Sort(x => x.Descending(a => a.CreatedAt)),
                // Default sorting by 'AuctionEnd' in ascending order
                _ => query.Sort(x => x.Ascending(a => a.AuctionEnd))
            };

            // Apply filtering based on the 'filterBy' parameter
            query = filterBy switch
            {
                // Filter to include only finished auctions (AuctionEnd date is in the past)
                "finished" => query.Match(x => x.AuctionEnd < DateTime.UtcNow),
                // Filter to include auctions ending soon (within the next 6 hours)
                "endingSoon" => query.Match(x => x.AuctionEnd < DateTime.UtcNow.AddHours(6) && x.AuctionEnd > DateTime.UtcNow),
                // Default filter to include only ongoing auctions (AuctionEnd date is in the future)
                _ => query.Match(x => x.AuctionEnd > DateTime.UtcNow)
            };

            // Apply filtering by seller if the 'seller' parameter is provided
            if (!string.IsNullOrEmpty(seller))
            {
                query.Match(x => x.Seller == seller);
            }

            // Apply filtering by winner if the 'winner' parameter is provided
            if (!string.IsNullOrEmpty(winner))
            {
                query.Match(x => x.Winner == winner);
            }
            
            // Set the page number and page size for the query
            query.PageNumber(pageNumber).PageSize(pageSize);

            // Execute the query asynchronously and get the results
            var result = await query.ExecuteAsync();

            // Return the query results to the client 
            return Ok(new
            {
                results = result.Results,
                pageCount = result.PageCount,
                totalCount = result.TotalCount
            });
        }
    }
}