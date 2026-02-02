using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BillingService.Models
{
    [Table("items")]
    public class Item
    {
        [Key]
        [Column("item_id")]
        public int ItemId { get; set; }

        [Column("item_name")]
        public string? ItemName { get; set; }

        [Column("category_id")]
        public int? CategoryId { get; set; }
    }
}