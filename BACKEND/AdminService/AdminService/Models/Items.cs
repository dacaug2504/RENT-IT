using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AdminService.Models
{
    [Table("items")]
    public class Items
    {
        [Key]
        [Column("item_id")]
        public int ItemId { get; set; }

        [Column("item_name")]
        [MaxLength(45)]
        [Required]
        public string? ItemName { get; set; }

        [Column("category_id")]
        public int? CategoryId { get; set; }   // ✅ nullable

        // Navigation Property
        [ForeignKey("CategoryId")]
        public Category? Category { get; set; }
    }
}