using AuctionService.Consumers;
using AuctionService.Data;
using MassTransit;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configures AuctionDbContext with PostgreSQL using the "DefaultConnection" string from app configuration.
builder.Services.AddDbContext<AuctionDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configures AutoMapper to use the mapping profiles defined in the RequestHelpers namespace
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

// Configures MassTransit to use RabbitMQ as the message broker
builder.Services.AddMassTransit(x =>
{
    // Configuring the outbox pattern with Entity Framework for the AuctionDbContext
    x.AddEntityFrameworkOutbox<AuctionDbContext>(cfg =>
    {
        cfg.QueryDelay = TimeSpan.FromSeconds(10);

        cfg.UsePostgres(); // Specifying the use of PostgreSQL for the outbox.
        cfg.UseBusOutbox(); // Enabling the bus outbox integration.
    });

    x.AddConsumersFromNamespaceContaining<AuctionCreatedFaultConsumer>();

    x.SetEndpointNameFormatter(new KebabCaseEndpointNameFormatter("auction", false));

    // Configuring MassTransit to use RabbitMQ as the transport
    x.UsingRabbitMq((context, cfg) =>
    {
        // Configuring the RabbitMQ host
        cfg.Host(builder.Configuration["RabbitMq:Host"], "/", host =>
        {
            host.Username(builder.Configuration.GetValue("RabbitMq:Username", "guest"));
            host.Password(builder.Configuration.GetValue("RabbitMq:Password", "guest"));
        });

        cfg.ConfigureEndpoints(context);
    });
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(cfg =>
    {
        cfg.Authority = builder.Configuration["IdentityServiceUrl"];
        cfg.RequireHttpsMetadata = false;

        // Set the audience validation to false, as we are not using the audience claim
        cfg.TokenValidationParameters.ValidateAudience = false;

        // Set the claim type to be used as the name identifier
        cfg.TokenValidationParameters.NameClaimType = "username";
    });

var app = builder.Build();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

try
{
    DbInitializer.InitDb(app);
}
catch (Exception e)
{
    Console.WriteLine(e);
}

app.Run();