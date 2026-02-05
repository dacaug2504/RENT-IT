using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AdminService.Models
{
    public class State
    {
        [Key]
        [Column("state_id")]
        public int StateId { get; set; }

        [Column("state_name")]
        [Required]
        [MaxLength(255)]
        public string StateName { get; set; } = string.Empty;

        // Navigation properties
        public virtual ICollection<City> Cities { get; set; } = new List<City>();
        public virtual ICollection<User> Users { get; set; } = new List<User>();
    }
}