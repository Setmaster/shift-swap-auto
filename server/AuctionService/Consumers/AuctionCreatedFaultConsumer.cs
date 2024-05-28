﻿using Contracts;
using MassTransit;

namespace AuctionService.Consumers;

public class AuctionCreatedFaultConsumer : IConsumer<Fault<AuctionCreated>>
{
    public async Task Consume(ConsumeContext<Fault<AuctionCreated>> context)
    {
        Console.WriteLine("--> Consuming faulty AuctionCreated event");
       
        /*
         Example of how to handle exceptions and republish the message
        var exception = context.Message.Exceptions.First();

        if (exception.ExceptionType == "System.ArgumentException")
        {
                context.Message.Message.Model = "Bar";
                await context.Publish(context.Message.Message);
        }
        else
        {
            Console.WriteLine("Not an argument exception - ignoring");
        }
        */
    }
}