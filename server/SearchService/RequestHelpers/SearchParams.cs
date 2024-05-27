namespace SearchService.RequestHelpers;

public class SearchParams
{
    public string SearchTerm { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 4;
    public string Seller { get; set; }
    public string Winner { get; set; }
    public string OrderBy { get; set; }
    public string FilterBy { get; set; }
    
    public void Deconstruct(out string searchTerm, out int pageNumber, out int pageSize, out string seller, out string winner, out string orderBy, out string filterBy)
    {
        searchTerm = SearchTerm;
        pageNumber = PageNumber;
        pageSize = PageSize;
        seller = Seller;
        winner = Winner;
        orderBy = OrderBy;
        filterBy = FilterBy;
    }
}