using System.ComponentModel.DataAnnotations;

namespace BillingService.Models.DTOs
{
    public class CreateBillDTO
    {
        [Required]
        public int CustomerId { get; set; }

        [Required]
        public int OwnerId { get; set; }

        [Required]
        public int ItemId { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Amount must be greater than 0")]
        public int Amount { get; set; }
    }
}