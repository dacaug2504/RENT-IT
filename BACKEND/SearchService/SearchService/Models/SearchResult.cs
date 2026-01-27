namespace SearchService.Models
{
    public class SearchResult
    {
        public List<Item> Items { get; set; }
        public string SearchTerm { get; set; }
        public int TotalResults { get; set; }
    }
}
