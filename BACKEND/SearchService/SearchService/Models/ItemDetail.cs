using System.ComponentModel.DataAnnotations.Schema;

namespace SearchService.Models
{
    public class ItemDetail
    {
        public int ItemId { get; set; }
        public string ItemName { get; set; }
        public int CategoryId { get; set; }
        public string CategoryType { get; set; }
        public string CategoryDescription { get; set; }
        public List<OwnerItemListing> AvailableListings { get; set; }
    }
}
