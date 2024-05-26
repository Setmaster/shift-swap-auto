using AuctionService.DTOs;
using AuctionService.Entities;
using AutoMapper;

namespace AuctionService.RequestHelpers;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        // Configures a mapping from Auction entity to AuctionDto
        CreateMap<Auction, AuctionDto>().IncludeMembers(x => x.Item);
       
        // Sets up a direct mapping from Item entity to AuctionDto
        CreateMap<Item, AuctionDto>();
        
        // Configures a mapping from CreateAuctionDto to Auction entity
        // Specifically maps the entire CreateAuctionDto to the Item property of Auction
        CreateMap<CreateAuctionDto, Auction>()
            .ForMember(d => d.Item, o => o.MapFrom(s => s));
    }
}