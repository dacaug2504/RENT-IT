using System.ComponentModel.DataAnnotations.Schema;

namespace SearchService.Models
{
    public class OwnerItemListing
    {
        [Column("ot_id")]
        public int OtId { get; set; }

        [Column("brand")]
        public string Brand { get; set; }

        [Column("description")]
        public string Description { get; set; }

        [Column("condition_type")]
        public string Condition { get; set; }

        [Column("rent_per_day")]
        public int RentPerDay { get; set; }

        [Column("deposit_amt")]
        public int DepositAmt { get; set; }

        [Column("status")]
        public string Status { get; set; }

        [Column("user_id")]
        public int OwnerId { get; set; }

        [Column("OwnerName")]
        public string OwnerName { get; set; }

        [Column("city_name")]
        public string CityName { get; set; }

        [Column("state_name")]
        public string StateName { get; set; }
    }
}
