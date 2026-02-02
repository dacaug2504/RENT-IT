using AdminService.Models;
using AdminService.Models.DTOs;

namespace AdminService.Extensions
{
    public static class MappingExtensions
    {
        // Map single Item entity to ItemResponseDto
        public static ItemResponseDto ToDto(this Items item)
        {
            return new ItemResponseDto
            {
                ItemId = item.ItemId,
                ItemName = item.ItemName ?? string.Empty,
                CategoryId = item.CategoryId,
                Category = item.Category != null
                    ? new CategoryResponseDto
                    {
                        CategoryId = item.Category.CategoryId,
                        Type = item.Category.Type ?? string.Empty,
                        Description = item.Category.Description,
                        Items = new List<ItemResponseDto>() // avoid recursion
                    }
                    : null
            };
        }

        // Map single Category entity to CategoryResponseDto
        public static CategoryResponseDto ToDto(this Category category)
        {
            return new CategoryResponseDto
            {
                CategoryId = category.CategoryId,
                Type = category.Type ?? string.Empty,
                Description = category.Description,
                Items = category.Items?.Select(i => i.ToDto()).ToList() ?? new List<ItemResponseDto>()
            };
        }
    }
}
