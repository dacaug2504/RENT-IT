using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BillingService.Models
{
    [Table("owner_items")]
    public class OwnerItem
    {
        [Key]
        [Column("ot_id")]
        public int OtId { get; set; }

        [Required]
        [Column("user_id")]
        public int UserId { get; set; }

        [Required]
        [Column("item_id")]
        public int ItemId { get; set; }

        [Required]
        [Column("brand")]
        [StringLength(45)]
        public string Brand { get; set; } = string.Empty;

        [Required]
        [Column("description")]
        [StringLength(80)]
        public string Description { get; set; } = string.Empty;

        [Column("condition_type")]
        [StringLength(50)]
        public string? ConditionType { get; set; }

        [Required]
        [Column("rent_per_day")]
        public int RentPerDay { get; set; }

        [Required]
        [Column("deposit_amt")]
        public int DepositAmt { get; set; }

        [Required]
        [Column("status")]
        [StringLength(20)]
        public string Status { get; set; } = "AVAILABLE";

        [Required]
        [Column("max_rent_days")]
        public int MaxRentDays { get; set; }

        // Navigation property
        [ForeignKey("UserId")]
        public virtual User? User { get; set; }
    }
}