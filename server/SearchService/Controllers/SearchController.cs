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
        public async Task<ActionResult<List<Item>>> SearchItems(string searchTerm)
        {
            // Create a query for the Item collection in MongoDB
            var query = DB.Find<Item>();
            
            // Sort the query results in ascending order by the 'Make' field
            query.Sort(x => x.Ascending(a => a.Make));

            // If a search term is provided, add a full text search filter and sort by text score
            if (!string.IsNullOrEmpty(searchTerm))
            {
                query.Match(Search.Full, searchTerm).SortByTextScore();
            }
            
            // Execute the query asynchronously and get the results
            var result = await query.ExecuteAsync();

            // Return the query results to the client
            return result;
        }
    }
}