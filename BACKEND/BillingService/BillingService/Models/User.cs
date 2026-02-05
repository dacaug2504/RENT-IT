using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BillingService.Models
{
    [Table("user")]
    public class User
    {
        [Key]
        [Column("user_id")]
        public int UserId { get; set; }

        [Required]
        [Column("role_id")]
        public int RoleId { get; set; }

        [Column("first_name")]
        [StringLength(255)]
        public string? FirstName { get; set; }

        [Column("last_name")]
        [StringLength(255)]
        public string? LastName { get; set; }

        [Column("password")]
        [StringLength(255)]
        public string? Password { get; set; }

        [Column("email")]
        [StringLength(255)]
        public string? Email { get; set; }

        [Required]
        [Column("phone_no")]
        public long PhoneNo { get; set; }

        [Column("address")]
        [StringLength(255)]
        public string? Address { get; set; }

        [Required]
        [Column("state_id")]
        public int StateId { get; set; }

        [Required]
        [Column("city_id")]
        public int CityId { get; set; }

        [Column("status")]
        public int? Status { get; set; }

        [Column("date_time")]
        public DateTime? DateTime { get; set; }

        // Navigation properties
        [ForeignKey("RoleId")]
        public virtual Role? Role { get; set; }

        [ForeignKey("CityId")]
        public virtual City? City { get; set; }

        [ForeignKey("StateId")]
        public virtual State? State { get; set; }
    }
}
