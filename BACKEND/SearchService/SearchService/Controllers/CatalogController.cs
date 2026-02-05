using Microsoft.AspNetCore.Mvc;
using SearchService.Services;

namespace SearchService.Controllers
{
    [ApiController]
    [Route("api/catalog")]
    public class CatalogController : ControllerBase
    {
        private readonly ICatalogService _catalogService;

        public CatalogController(ICatalogService catalogService)
        {
            _catalogService = catalogService;
        }

        /// <summary>
        /// HOME PAGE: Get all categories
        /// </summary>
        /// <returns>List of categories with item count</returns>
        [HttpGet("categories")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _catalogService.GetCategoriesForHomePageAsync();
            return Ok(new { success = true, data = categories });
        }

        /// <summary>
        /// CATEGORY PAGE: Get all items in a category
        /// </summary>
        /// <param name="categoryId">Category ID</param>
        /// <param name="cityId">Optional: Filter by city</param>
        /// <returns>List of items</returns>
        [HttpGet("categories/{categoryId}/items")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
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

        /// <summary>
        /// ITEM DETAIL PAGE: Get item details with all available listings
        /// </summary>
        /// <param name="itemId">Item ID</param>
        /// <returns>Item details with owner listings</returns>
        [HttpGet("items/{itemId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
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

   
        /// SEARCH: Search items by name
       
        [HttpGet("search")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> SearchItems([FromQuery] string query)
        {
            var results = await _catalogService.SearchItemsAsync(query);
            return Ok(new { success = true, data = results });
        }
    }
}
