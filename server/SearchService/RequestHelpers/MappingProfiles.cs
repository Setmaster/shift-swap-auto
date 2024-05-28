using AutoMapper;
using Contracts;
using SearchService.Models;

namespace SearchService.RequestHelpers;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        // Map AuctionCreated to Item
        CreateMap<AuctionCreated, Item>();
        
        // Map AuctionUpdated to Item
        CreateMap<AuctionUpdated, Item>();
    }
    
    
}