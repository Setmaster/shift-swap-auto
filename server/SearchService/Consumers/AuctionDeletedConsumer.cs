using AutoMapper;
using Contracts;
using MassTransit;
using MongoDB.Entities;
using SearchService.Models;

namespace SearchService.Consumers;

public class AuctionDeletedConsumer: IConsumer<AuctionDeleted>
{
    private readonly IMapper _mapper;

    public AuctionDeletedConsumer(IMapper mapper)
    {
        _mapper = mapper;
    }
    public async Task Consume(ConsumeContext<AuctionDeleted> context)
    {
        Console.WriteLine($"--> Consuming AuctionDeleted event {context.Message.Id}");

        var itemId = context.Message.Id;
        
        var result = await DB.DeleteAsync<Item>(itemId);
        
        if (!result.IsAcknowledged)
        {
            throw new MessageException(typeof(AuctionDeleted), "Could not delete item from the database");
        }
    }
}