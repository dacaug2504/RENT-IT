using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AdminService.Models
{
    [Table("user")]
    public class User
    {
        [Key]
        [Column("user_id")]
        public int UserId { get; set; }

        // ---------- ROLE ----------
        [Column("role_id")]
        public int RoleId { get; set; }

        [ForeignKey(nameof(RoleId))]          // ✅ THIS FIXES ROLE NULL ISSUE
        public virtual Role? Role { get; set; }

        // ---------- BASIC INFO ----------
        [Column("first_name")]
        public string? FirstName { get; set; }

        [Column("last_name")]
        public string? LastName { get; set; }

        [Column("password")]
        public string? Password { get; set; }

        [Column("email")]
        public string? Email { get; set; }

        [Column("phone_no")]
        public long PhoneNo { get; set; }

        [Column("address")]
        public string? Address { get; set; }

        // ---------- LOCATION ----------
        [Column("state_id")]
        public int StateId { get; set; }

        [ForeignKey(nameof(StateId))]
        public virtual State? State { get; set; }

        [Column("city_id")]
        public int CityId { get; set; }

        [ForeignKey(nameof(CityId))]
        public virtual City? City { get; set; }

        // ---------- STATUS ----------
        [Column("status")]
        public int? Status { get; set; }

        [Column("date_time")]
        public DateTime? DateTime { get; set; }
    }
}
