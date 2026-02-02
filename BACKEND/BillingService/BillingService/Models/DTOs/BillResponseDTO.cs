namespace BillingService.Models.DTOs
{
    public class BillResponseDTO
    {
        public int BillNo { get; set; }
        public DateTime BillDate { get; set; } = DateTime.Now;

        // Customer Info
        public int CustomerId { get; set; }
        public string? CustomerName { get; set; }
        public string? CustomerEmail { get; set; }
        public string? CustomerPhone { get; set; }
        public string? CustomerAddress { get; set; }
        public string? CustomerCity { get; set; }
        public string? CustomerState { get; set; }

        // Owner Info
        public int OwnerId { get; set; }
        public string? OwnerName { get; set; }
        public string? OwnerEmail { get; set; }
        public string? OwnerPhone { get; set; }
        public string? OwnerAddress { get; set; }
        public string? OwnerCity { get; set; }
        public string? OwnerState { get; set; }

        // Item Info
        public int ItemId { get; set; }
        public string? ItemBrand { get; set; }
        public string? ItemDescription { get; set; }
        public string? ItemCondition { get; set; }
        public int RentPerDay { get; set; }
        public int DepositAmount { get; set; }

        // Bill Info
        public int Amount { get; set; }

        // Calculated fields (optional - for future enhancements)
        public int? NumberOfDays { get; set; }
        public int? TotalRent { get; set; }

        // Customer Info
    

        // Owner Info
        

    }
}