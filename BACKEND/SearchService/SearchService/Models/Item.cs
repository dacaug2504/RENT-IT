using System.ComponentModel.DataAnnotations.Schema;

namespace SearchService.Models
{
    public class Item
    {
        public int ItemId { get; set; }
        public string ItemName { get; set; }
        public int CategoryId { get; set; }
        public string CategoryType { get; set; }
        public int AvailableCount { get; set; }
    }
}
 