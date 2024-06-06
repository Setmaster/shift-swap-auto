using AuctionService.DTOs;
using AuctionService.Models;
using AutoMapper;
using Contracts;

namespace AuctionService.RequestHelpers;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        // Configures a mapping from Auction entity to AuctionDto
        // The properties from the nested Item entity are also mapped
        CreateMap<Auction, AuctionDto>().IncludeMembers(x => x.Item);
       
        // Sets up a direct mapping from Item entity to AuctionDto
        CreateMap<Item, AuctionDto>();
        
        // Configures a mapping from CreateAuctionDto to Auction entity
        // Specifically maps the entire CreateAuctionDto to the Item property of Auction
        CreateMap<CreateAuctionDto, Auction>()
            .ForMember(d => d.Item, o => o.MapFrom(s => s));
        
        // Configures a mapping from CreateAuctionDto to Item entity
        // This explicitly defines the mapping from CreateAuctionDto to Item, which is necessary to support the nested mapping
        CreateMap<CreateAuctionDto, Item>();

        // Configures a mapping from AuctionDto to AuctionCreated
        CreateMap<AuctionDto, AuctionCreated>();
        
        // Configures a mapping from Auction to AuctionUpdated
        CreateMap<Auction, AuctionUpdated>().IncludeMembers(x=>x.Item);
        
        // Configures a mapping from Item to AuctionUpdated
        CreateMap<Item, AuctionUpdated>();
    }
    
    
}