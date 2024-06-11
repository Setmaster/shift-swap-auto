using MassTransit;
using NotificationsService.Consumers;
using NotificationsService.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Configures MassTransit to use RabbitMQ as the message broker
builder.Services.AddMassTransit(x =>
{
    x.AddConsumersFromNamespaceContaining<AuctionCreatedConsumer>();
    
    x.SetEndpointNameFormatter(new KebabCaseEndpointNameFormatter("nt", false));

    // Configuring MassTransit to use RabbitMQ as the transport
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

        cfg.ConfigureEndpoints(context);
    });
});

builder.Services.AddSignalR();

var app = builder.Build();

app.MapHub<NotificationHub>("/notifications");

app.Run();
