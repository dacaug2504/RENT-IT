using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AdminService.Models
{
    [Table("category")]
    public class Category
    {
        [Key]
        [Column("category_id")]
        public int CategoryId { get; set; }

        [Column("type")]
        [MaxLength(45)]
        [Required]
        public string? Type { get; set; }

        [Column("description")]
        [MaxLength(80)]
        public string? Description { get; set; }

        // Navigation Property
        public ICollection<Items> Items { get; set; } = new List<Items>();
    }
}