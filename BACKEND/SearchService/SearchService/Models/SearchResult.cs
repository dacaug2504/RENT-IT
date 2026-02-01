using System.ComponentModel.DataAnnotations.Schema;

namespace SearchService.Models
{
    public class SearchResult
    {
        [NotMapped]
        public List<Item> Items { get; set; }

        [NotMapped]
        public string SearchTerm { get; set; }

        [NotMapped]
        public int TotalResults { get; set; }
        public List<OwnerItem> OwnerItems { get; set; }
    }
}
