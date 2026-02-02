using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BillingService.Models
{
    [Table("bill")]
    public class Bill
    {
        [Key]
        [Column("bill_no")]
        public int BillNo { get; set; }

        [Required]
        [Column("customer_id")]
        public int CustomerId { get; set; }

        [Required]
        [Column("owner_id")]
        public int OwnerId { get; set; }

        [Required]
        [Column("item_id")]
        public int ItemId { get; set; }

        [Required]
        [Column("amount")]
        public int Amount { get; set; }

        // Navigation properties
        [ForeignKey("CustomerId")]
        public virtual User? Customer { get; set; }

        [ForeignKey("OwnerId")]
        public virtual User? Owner { get; set; }

        [ForeignKey("ItemId")]
        public virtual OwnerItem? OwnerItem { get; set; }
    }
}