using System.Net;
using MassTransit;
using Polly;
using Polly.Extensions.Http;
using SearchService.Consumers;
using SearchService.Data;
using SearchService.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configures the AuctionServiceHttpClient to use a retry policy
builder.Services.AddHttpClient<AuctionServiceHttpClient>().AddPolicyHandler(GetPolicy());

// Configures AutoMapper to use the mapping profiles defined in the RequestHelpers namespace
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

// Configures MassTransit to use RabbitMQ as the message broker
builder.Services.AddMassTransit(x =>
{
    // Adds all consumers (message handlers) from the namespace containing AuctionCreatedConsumer
    x.AddConsumersFromNamespaceContaining<AuctionCreatedConsumer>();

    // Sets the naming convention for the endpoints to use kebab-case format with the prefix "search" eg. search-auction-created
    x.SetEndpointNameFormatter(new KebabCaseEndpointNameFormatter("search", false));

    // Configures MassTransit to use RabbitMQ as the transport protocol
    x.UsingRabbitMq((context, cfg) =>
    {
        // Configures the message retry policy for the bus
        cfg.UseMessageRetry(r =>
        {
            r.Handle<RabbitMqConnectionException>();
            r.Interval(5, TimeSpan.FromSeconds(10));
        });

        // Configuring the RabbitMQ host
        cfg.Host(builder.Configuration["RabbitMq:Host"], "/", host =>
        {
            host.Username(builder.Configuration.GetValue("RabbitMq:Username", "guest"));
            host.Password(builder.Configuration.GetValue("RabbitMq:Password", "guest"));
        });

        cfg.ReceiveEndpoint("search-auction-created", e =>
        {
            // Configures the consumer to use a message retry policy
            e.UseMessageRetry(r => r.Interval(5, 5));

            e.ConfigureConsumer<AuctionCreatedConsumer>(context);
        });

        // Automatically configures all endpoints defined by the consumers in the context
        cfg.ConfigureEndpoints(context);
    });
});

var app = builder.Build();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

// Registering a callback to be executed when the application has fully started
app.Lifetime.ApplicationStarted.Register(async () =>
{
    // Configuring a retry policy for initializing the database, mongodb entities can error will a timeout exception if the database is not ready
    await Policy.Handle<TimeoutException>()
        .WaitAndRetryAsync(5, retryAttempt => TimeSpan.FromSeconds(10))
        .ExecuteAndCaptureAsync(async () =>
        {
            // Attempting to initialize the database
            await DbInitializer.InitDb(app);
        });
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