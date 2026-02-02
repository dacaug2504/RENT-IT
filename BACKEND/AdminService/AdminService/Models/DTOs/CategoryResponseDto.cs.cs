namespace AdminService.Models.DTOs
{
    public class CategoryResponseDto
    {
        public int CategoryId { get; set; }
        public string Type { get; set; } = string.Empty;
        public string? Description { get; set; }
        public List<ItemResponseDto> Items { get; set; } = new();
    }

    public class ItemResponseDto
    {
        public int ItemId { get; set; }
        public string ItemName { get; set; } = string.Empty;
        public int? CategoryId { get; set; }

        // Nullable to avoid null reference warnings
        public CategoryResponseDto? Category { get; set; }
    }
}
