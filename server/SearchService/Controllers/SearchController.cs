using Microsoft.AspNetCore.Mvc;
using MongoDB.Entities;
using SearchService.Models;

namespace SearchService.Controllers
{
    [ApiController]
    [Route("api/search")]
    public class SearchController : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<List<Item>>> SearchItems(string searchTerm, int pageNumer = 1, int pageSize = 4)
        {
            // Create a paged search query for the 'Item' collection
            var query = DB.PagedSearch<Item>();

            // Sort the query results in ascending order by the 'Make' field
            query.Sort(x => x.Ascending(a => a.Make));

            // If a search term is provided, add a full text search filter and sort by text score
            if (!string.IsNullOrEmpty(searchTerm))
            {
                query.Match(Search.Full, searchTerm).SortByTextScore();
            }

            // Set the page number and page size for the query
            query.PageNumber(pageNumer).PageSize(pageSize);

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