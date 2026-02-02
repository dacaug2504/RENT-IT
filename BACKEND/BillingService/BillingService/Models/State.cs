using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BillingService.Models
{
    [Table("state")]
    public class State
    {
        [Key]
        [Column("state_id")]
        public int StateId { get; set; }

        [Column("state_name")]
        public string? StateName { get; set; }
    }
}
