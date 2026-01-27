using System.ComponentModel.DataAnnotations.Schema;

namespace SearchService.Models
{
    public class OwnerItemListing
    {
        public int OtId { get; set; }
        public string Brand { get; set; }
        public string Description { get; set; }
        public string Condition { get; set; }
        public int RentPerDay { get; set; }
        public int DepositAmt { get; set; }
        public string Status { get; set; }
        public int OwnerId { get; set; }
        public string OwnerName { get; set; }
        public string CityName { get; set; }
        public string StateName { get; set; }
    }
}
