
using SearchService.Models;

namespace SearchService.Repositories
{
    public interface ICatalogRepository
    {
  Task<List<Category>> GetAllCategoriesAsync();
        Task<List<Item>> GetItemsByCategoryAsync(int categoryId);
        Task<ItemDetail> GetItemDetailAsync(int itemId);
        Task<SearchResult> SearchItemsAsync(string searchTerm);
        Task<List<Item>> GetItemsByCategoryAndCityAsync(int categoryId, int cityId);
    }
}
