
using SearchService.Models;
using SearchService.Repositories;

namespace SearchService.Services
{
    public interface ICatalogService
    {
        Task<List<Category>> GetCategoriesForHomePageAsync();
        Task<List<Item>> GetItemsForCategoryAsync(int categoryId);
        Task<ItemDetail> GetItemDetailsAsync(int itemId);
        Task<SearchResult> SearchItemsAsync(string searchTerm);
        Task<List<Item>> FilterItemsByLocationAsync(int categoryId, int cityId);

    }
    public class CatalogService : ICatalogService
    {
        private readonly ICatalogRepository _repository;

        public CatalogService(ICatalogRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<Category>> GetCategoriesForHomePageAsync()
        {
            return await _repository.GetAllCategoriesAsync();
        }

        public async Task<List<Item>> GetItemsForCategoryAsync(int categoryId)
        {
            if (categoryId <= 0)
                throw new ArgumentException("Invalid category ID", nameof(categoryId));

            return await _repository.GetItemsByCategoryAsync(categoryId);
        }

        public async Task<ItemDetail> GetItemDetailsAsync(int itemId)
        {
            if (itemId <= 0)
                throw new ArgumentException("Invalid item ID", nameof(itemId));

            var itemDetail = await _repository.GetItemDetailAsync(itemId);

            if (itemDetail == null)
                throw new KeyNotFoundException($"Item with ID {itemId} not found");

            return itemDetail;
        }

        public async Task<SearchResult> SearchItemsAsync(string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                return new SearchResult
                {
                    Items = new List<Item>(),
                    SearchTerm = searchTerm,
                    TotalResults = 0
                };
            }

            return await _repository.SearchItemsAsync(searchTerm.Trim());
        }

        public async Task<List<Item>> FilterItemsByLocationAsync(int categoryId, int cityId)
        {
            if (categoryId <= 0)
                throw new ArgumentException("Invalid category ID", nameof(categoryId));

            if (cityId <= 0)
                throw new ArgumentException("Invalid city ID", nameof(cityId));

            return await _repository.GetItemsByCategoryAndCityAsync(categoryId, cityId);
        }
    }
}
