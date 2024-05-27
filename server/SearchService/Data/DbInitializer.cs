using System.Text.Json;
using MongoDB.Driver;
using MongoDB.Entities;
using SearchService.Models;

namespace SearchService.Data;

public class DbInitializer
{
    public static async Task InitDb(WebApplication app)
    {
        // Initialize the database
        await DB.InitAsync("SearchDb", MongoClientSettings
            .FromConnectionString(app.Configuration.GetConnectionString("MongoDbConnection")));

        // Create a text index on the Make, Model and Color fields
        await DB.Index<Item>()
            .Key(x => x.Make, KeyType.Text)
            .Key(x => x.Model, KeyType.Text)
            .Key(x => x.Color, KeyType.Text)
            .CreateAsync();
        
        var count = await DB.CountAsync<Item>();

        if (count == 0)
        {
            Console.WriteLine("No data found. Seeding the database...");
            var itemData = await File.ReadAllTextAsync("Data/auctions.json");
            
            var options = new JsonSerializerOptions{PropertyNameCaseInsensitive = true};
            
            // Deserialize the JSON data into a list of Item objects
            var items = JsonSerializer.Deserialize<List<Item>>(itemData, options);

            // Save the items to the database
            await DB.SaveAsync(items);
        }
    }
}