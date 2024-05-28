using AutoMapper;
using Contracts;
using MassTransit;
using MongoDB.Entities;
using SearchService.Models;

namespace SearchService.Consumers;

public class AuctionCreatedConsumer : IConsumer<AuctionCreated>
{
    private readonly IMapper _mapper;

    public AuctionCreatedConsumer(IMapper mapper)
    {
        _mapper = mapper;
    }
    
    public async Task Consume(ConsumeContext<AuctionCreated> context)
    {
        Console.WriteLine($"--> Consuming AuctionCreated event {context.Message.Id}");
        
        // Map AuctionCreated to Item
        var item = _mapper.Map<Item>(context.Message);

        /*
         Example of how to handle exceptions and republish the message
        if (item.Model == "Foo")
        {
            throw new ArgumentException("Cannot sell cars with name of Foo.");
        }
        */
        
        // Save Item to MongoDB
        await item.SaveAsync();
    }
}
