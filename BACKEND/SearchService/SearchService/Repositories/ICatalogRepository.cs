
using SearchService.Models;

namespace SearchService.Repositories
{
    public interface ICatalogRepository
    {
        // Home Page - Show all categories
        Task<List<Category>> GetAllCategoriesAsync();

        // Category Page - Show items in selected category
        Task<List<Item>> GetItemsByCategoryAsync(int categoryId);

        // Item Detail Page - Show specific item with all available listings
        Task<ItemDetail> GetItemDetailAsync(int itemId);

        // Search - Search items by name
        Task<SearchResult> SearchItemsAsync(string searchTerm);

        // Filter items by location
        Task<List<Item>> GetItemsByCategoryAndCityAsync(int categoryId, int cityId);
    }
}
