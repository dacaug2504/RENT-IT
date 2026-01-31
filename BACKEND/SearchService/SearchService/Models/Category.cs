using System.ComponentModel.DataAnnotations.Schema;

namespace SearchService.Models
{
    public class Category
    {
        [Column("category_id")]
        public int CategoryId { get; set; }

        [Column("type")]
        public string Type { get; set; }

        [Column("description")]
        public string Description { get; set; }

        [Column("ItemCount")]
        public int ItemCount { get; set; }

        public ICollection<Item> Items { get; set; }
    }
}
