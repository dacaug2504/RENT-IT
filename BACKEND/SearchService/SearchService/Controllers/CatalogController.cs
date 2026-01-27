using Microsoft.AspNetCore.Mvc;
using SearchService.Services;

namespace SearchService.Controllers
{
    public class CatalogController : ControllerBase
    {
        private readonly ICatalogService _catalogService;

        public CatalogController(ICatalogService catalogService)
        {
            _catalogService = catalogService;
        }

        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _catalogService.GetCategoriesForHomePageAsync();
            return Ok(new { success = true, data = categories });
        }

        [HttpGet("categories/{categoryId}/items")]
        public async Task<IActionResult> GetItemsByCategory(int categoryId, [FromQuery] int? cityId = null)
        {
            try
            {
                var items = cityId.HasValue
                    ? await _catalogService.FilterItemsByLocationAsync(categoryId, cityId.Value)
                    : await _catalogService.GetItemsForCategoryAsync(categoryId);

                return Ok(new { success = true, data = items, count = items.Count });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("items/{itemId}")]
        public async Task<IActionResult> GetItemDetail(int itemId)
        {
            try
            {
                var itemDetail = await _catalogService.GetItemDetailsAsync(itemId);
                return Ok(new { success = true, data = itemDetail });
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { success = false, message = "Item not found" });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchItems([FromQuery] string query)
        {
            var results = await _catalogService.SearchItemsAsync(query);
            return Ok(new { success = true, data = results });
        }
    }
}
