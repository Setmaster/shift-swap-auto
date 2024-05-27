using AutoMapper;
using Contracts;
using SearchService.Models;

namespace SearchService.RequestHelpers;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        // Map AuctionUpdated to UpdateAuctionDto
        CreateMap<AuctionCreated, Item>();
    }
    
    
}