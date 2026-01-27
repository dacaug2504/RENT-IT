using System.ComponentModel.DataAnnotations.Schema;

namespace SearchService.Models
{
    public class Category
    {
        public int CategoryId { get; set; }
        public string Type { get; set; }
        public string Description { get; set; }
        public int ItemCount { get; set; }
    }
}
