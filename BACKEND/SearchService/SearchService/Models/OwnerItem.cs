using System.ComponentModel.DataAnnotations.Schema;

namespace SearchService.Models
{
    public class OwnerItem
    {
        [Column("ot_id")]
        public int OtId { get; set; }

        [Column("user_id")]
        public int UserId { get; set; }

        [Column("item_id")]
        public int ItemId { get; set; }

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

        [Column("image_id")]
        public int ImageId { get; set; }

        // Owner Details
        [Column("OwnerFirstName")]
        public string OwnerFirstName { get; set; }

        [Column("OwnerLastName")]
        public string OwnerLastName { get; set; }

        [Column("OwnerEmail")]
        public string OwnerEmail { get; set; }

        [Column("OwnerPhone")]
        public long OwnerPhone { get; set; }

        [Column("CityName")]
        public string CityName { get; set; }

        [Column("StateName")]
        public string StateName { get; set; }

        // Item Details
        [Column("ItemName")]
        public string ItemName { get; set; }

        [Column("CategoryType")]
        public string CategoryType { get; set; }
    }
}
