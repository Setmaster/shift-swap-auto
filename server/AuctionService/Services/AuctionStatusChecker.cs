using AuctionService.Data;
using AuctionService.Models;
using Contracts;
using MassTransit;

namespace AuctionService.Services;

public class AuctionStatusChecker : BackgroundService
{
    private readonly ILogger<AuctionStatusChecker> _logger;
    private readonly IServiceProvider _serviceProvider;

    public AuctionStatusChecker(ILogger<AuctionStatusChecker> logger, IServiceProvider serviceProvider)
    {
        _logger = logger;
        _serviceProvider = serviceProvider;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Auction status checker running.");

        while (!stoppingToken.IsCancellationRequested)
        {
            await CheckAuctionsAsync(stoppingToken);
            await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken); // Check every minute
        }

        _logger.LogInformation("Auction status checker stopping.");
    }

    private async Task CheckAuctionsAsync(CancellationToken stoppingToken)
    {
        using var scope = _serviceProvider.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<AuctionDbContext>();
        var publishEndpoint = scope.ServiceProvider.GetRequiredService<IPublishEndpoint>();

        var now = DateTime.UtcNow;
        var auctionsToFinish = dbContext.Auctions
            .Where(a => a.Status == Status.Live && a.AuctionEnd <= now)
            .ToList();

        foreach (var auction in auctionsToFinish)
        {
            auction.Status = Status.Finished;
            auction.UpdatedAt = now;
            dbContext.Auctions.Update(auction);

            await publishEndpoint.Publish(new AuctionFinished
            {
                AuctionId = auction.Id.ToString(),
                ItemSold = auction.CurrentHighBid >= auction.ReservePrice,
                Winner = auction.CurrentHighBid >= auction.ReservePrice ? auction.Winner : null,
                Seller = auction.Seller,
                Amount = auction.CurrentHighBid >= auction.ReservePrice ? auction.CurrentHighBid : (int?)null
            });

            _logger.LogInformation($"Auction {auction.Id} finished.");
        }

        await dbContext.SaveChangesAsync(stoppingToken);
    }
}
