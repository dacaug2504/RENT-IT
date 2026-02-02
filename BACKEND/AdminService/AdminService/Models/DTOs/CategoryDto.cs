namespace AdminService.Models.DTOs
{
    public class CategoryDto
    {
        public int CategoryId { get; set; }
        public string? Type { get; set; }
        public string? Description { get; set; }
        public List<ItemDto> Items { get; set; } = new();
    }

    public class ItemDto
    {
        public int ItemId { get; set; }
        public string? ItemName { get; set; }
        public int CategoryId { get; set; }
    }
}
