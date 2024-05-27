using System.Net;
using MongoDB.Driver;
using MongoDB.Entities;
using Polly;
using Polly.Extensions.Http;
using SearchService.Data;
using SearchService.Models;
using SearchService.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddHttpClient<AuctionServiceHttpClient>().AddPolicyHandler(GetPolicy());

var app = builder.Build();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

// Registering a callback to be executed when the application has fully started
app.Lifetime.ApplicationStarted.Register(async () =>
{
    try
    {
        // Attempting to initialize the database
        await DbInitializer.InitDb(app);
    }
    catch (Exception ex)
    {
        Console.WriteLine(ex.Message);
    }
});

app.Run();

// This method defines and returns an asynchronous retry policy for HTTP requests.
static IAsyncPolicy<HttpResponseMessage> GetPolicy()
{
    // The policy is defined using extension methods provided by Polly's HttpPolicyExtensions
    return HttpPolicyExtensions

        // The HandleTransientHttpError method configures the policy to handle transient HTTP errors
        // 5xx server errors and 408 request timeout errors
        .HandleTransientHttpError()

        // The OrResult method adds an additional condition to the policy
        // In this case, it specifies that HTTP 404 Not Found responses should also be treated as transient errors
        .OrResult(msg => msg.StatusCode == HttpStatusCode.NotFound)

        // The WaitAndRetryForeverAsync method defines the retry behavior
        // It specifies that the policy should retry indefinitely, with a delay of 3 seconds between each retry attempt
        .WaitAndRetryForeverAsync(_ => TimeSpan.FromSeconds(3));
}