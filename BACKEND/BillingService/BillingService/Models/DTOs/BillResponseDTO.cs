namespace BillingService.Models.DTOs
{
    public class BillResponseDTO
    {
        // Bill Info
        public int BillNo { get; set; }
        public DateTime BillDate { get; set; } = DateTime.Now;
        public int Amount { get; set; }

        // Date fields from OrderTable (NEW - REQUIRED!)
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? NumberOfDays { get; set; }
        public int? TotalRent { get; set; }

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
    }
}