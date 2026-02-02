using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BillingService.Models
{
    [Table("order_table")]
    public class OrderTable
    {
        [Key]
        [Column("order_id")]
        public int OrderId { get; set; }

        [Column("customer_id")]
        public int CustomerId { get; set; }

        [Column("owner_id")]
        public int OwnerId { get; set; }

        [Column("start_date")]
        public DateTime StartDate { get; set; }

        [Column("end_date")]
        public DateTime EndDate { get; set; }

        [Column("payment_status")]
        public string? PaymentStatus { get; set; }

        [Column("delivery_mode")]
        public string? DeliveryMode { get; set; }

        [Column("owner_item_id")]
        public int OwnerItemId { get; set; }
    }
}