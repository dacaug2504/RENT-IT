using System.ComponentModel.DataAnnotations.Schema;

namespace SearchService.Models
{
    public class Item
    {
        [Column("item_id")]
        public int ItemId { get; set; }

        [Column("item_name")]
        public string ItemName { get; set; }

        [Column("category_id")]
        public int CategoryId { get; set; }

        [Column("CategoryType")]
        public string CategoryType { get; set; }

        [Column("AvailableCount")]
        public int AvailableCount { get; set; }

        
    }
}
 