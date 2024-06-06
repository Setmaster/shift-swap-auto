using Contracts;
using MassTransit;
using Microsoft.AspNetCore.SignalR;
using NotificationsService.Hubs;

namespace NotificationsService.Consumers;

public class BidPlacedConsumer: IConsumer<BidPlaced>
{
    private readonly IHubContext<NotificationHub> _hubContext;

    public BidPlacedConsumer(IHubContext<NotificationHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task Consume(ConsumeContext<BidPlaced> context)
    {
        Console.WriteLine("===> Received BidPlaced message");

        await _hubContext.Clients.All.SendAsync("BidPlaced", context.Message);
    }
}