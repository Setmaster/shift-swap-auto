using AuctionService.Data;
using MassTransit;
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
    x.UsingRabbitMq((context, cfg) =>
    {
        cfg.ConfigureEndpoints(context);
    });
});

var app = builder.Build();

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
