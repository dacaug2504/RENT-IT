using AdminService.Models;
using AdminService.Models.DTOs;

namespace AdminService.Services
{
    public interface ICategoryService
    {
        Task<List<CategoryResponseDto>> GetAllCategoriesAsync();
        Task<CategoryResponseDto?> GetCategoryByIdAsync(int categoryId);

        Task<Category> CreateCategoryAsync(CreateCategoryDto dto);
        Task<Category?> UpdateCategoryAsync(int categoryId, UpdateCategoryDto dto);
        Task<bool> DeleteCategoryAsync(int categoryId);

        Task<List<Items>> GetAllItemsAsync();
        Task<List<Items>> GetItemsByCategoryAsync(int categoryId);
        Task<Items?> GetItemByIdAsync(int itemId);
        Task<Items> CreateItemAsync(CreateItemDto dto);
        Task<Items?> UpdateItemAsync(int itemId, UpdateItemDto dto);
        Task<bool> DeleteItemAsync(int itemId);
    }
}


//using AdminService.Models;
//using AdminService.Models.DTOs;

//namespace AdminService.Services
//{
//    public interface ICategoryService
//    {
//        // Category Management
//        Task<List<Category>> GetAllCategoriesAsync();
//        Task<Category?> GetCategoryByIdAsync(int categoryId);
//        Task<Category> CreateCategoryAsync(CreateCategoryDto dto);
//        Task<Category?> UpdateCategoryAsync(int categoryId, UpdateCategoryDto dto);
//        Task<bool> DeleteCategoryAsync(int categoryId);

//        // Items Management
//        Task<List<Items>> GetAllItemsAsync();
//        Task<List<Items>> GetItemsByCategoryAsync(int categoryId);
//        Task<Items?> GetItemByIdAsync(int itemId);
//        Task<Items> CreateItemAsync(CreateItemDto dto);
//        Task<Items?> UpdateItemAsync(int itemId, UpdateItemDto dto);
//        Task<bool> DeleteItemAsync(int itemId);
//    }
//}