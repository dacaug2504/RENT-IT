using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AdminService.Models
{
    public class City
    {
        [Key]
        [Column("city_id")]
        public int CityId { get; set; }

        [Column("city_name")]
        [Required]
        [MaxLength(255)]
        public string CityName { get; set; } = string.Empty;

        [Column("state_id")]
        public int? StateId { get; set; }

        // Navigation properties
        [ForeignKey("StateId")]
        public virtual State? State { get; set; }
        public virtual ICollection<User> Users { get; set; } = new List<User>();
    }
}