using Contracts;
using MassTransit;
using Microsoft.AspNetCore.SignalR;
using NotificationsService.Hubs;

namespace NotificationsService.Consumers;

public class AuctionDeletedConsumer: IConsumer<AuctionDeleted>
{
    private readonly IHubContext<NotificationHub> _hubContext;

    public AuctionDeletedConsumer(IHubContext<NotificationHub> hubContext)
    {
        _hubContext = hubContext;
    }
    
    public async Task Consume(ConsumeContext<AuctionDeleted> context)
    {
        Console.WriteLine("===> Received AuctionDeleted message");
        
        await _hubContext.Clients.All.SendAsync("AuctionDeleted", context.Message);
    }
}