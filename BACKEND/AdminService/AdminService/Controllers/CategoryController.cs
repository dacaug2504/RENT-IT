using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AdminService.Models;
using AdminService.Models.DTOs;
using AdminService.Services;
using AdminService.Utils;

namespace AdminService.Controllers
{
    [ApiController]
    [Route("api/admin")]
    [Authorize]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;
        private readonly ILogger<CategoryController> _logger;

        public CategoryController(ICategoryService categoryService, ILogger<CategoryController> logger)
        {
            _categoryService = categoryService;
            _logger = logger;
        }

        #region Category Management

        [HttpGet("categories")]
        public async Task<ActionResult<ApiResponse<List<CategoryResponseDto>>>> GetAllCategories()
        {
            try
            {
                if (!JwtUtil.IsAdmin(User))
                    return Forbid("Only administrators can access this resource");

                var categories = await _categoryService.GetAllCategoriesAsync();

                return Ok(new ApiResponse<List<CategoryResponseDto>>
                {
                    Success = true,
                    Message = $"Retrieved {categories.Count} categories",
                    Data = categories
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all categories");
                return StatusCode(500, new ApiResponse<List<CategoryResponseDto>>
                {
                    Success = false,
                    Message = "Internal server error",
                    Data = null
                });
            }
        }

        [HttpGet("categories/{categoryId}")]
        public async Task<ActionResult<ApiResponse<CategoryResponseDto>>> GetCategoryById(int categoryId)
        {
            try
            {
                if (!JwtUtil.IsAdmin(User))
                    return Forbid("Only administrators can access this resource");

                var category = await _categoryService.GetCategoryByIdAsync(categoryId);

                if (category == null)
                    return NotFound(new ApiResponse<CategoryResponseDto>
                    {
                        Success = false,
                        Message = $"Category with ID {categoryId} not found",
                        Data = null
                    });

                return Ok(new ApiResponse<CategoryResponseDto>
                {
                    Success = true,
                    Message = "Category found",
                    Data = category
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting category {categoryId}");
                return StatusCode(500, new ApiResponse<CategoryResponseDto>
                {
                    Success = false,
                    Message = "Internal server error",
                    Data = null
                });
            }
        }

        [HttpPost("categories")]
        public async Task<ActionResult<ApiResponse<CategoryResponseDto>>> CreateCategory([FromBody] CreateCategoryDto dto)
        {
            try
            {
                if (!JwtUtil.IsAdmin(User))
                    return Forbid("Only administrators can access this resource");

                if (string.IsNullOrWhiteSpace(dto.Type))
                    return BadRequest(new ApiResponse<CategoryResponseDto>
                    {
                        Success = false,
                        Message = "Category type is required",
                        Data = null
                    });

                var categoryEntity = await _categoryService.CreateCategoryAsync(dto);

                var categoryDto = new CategoryResponseDto
                {
                    CategoryId = categoryEntity.CategoryId,
                    Type = categoryEntity.Type ?? string.Empty,
                    Description = categoryEntity.Description,
                    Items = new List<ItemResponseDto>()
                };

                return CreatedAtAction(nameof(GetCategoryById),
                    new { categoryId = categoryDto.CategoryId },
                    new ApiResponse<CategoryResponseDto>
                    {
                        Success = true,
                        Message = "Category created successfully",
                        Data = categoryDto
                    });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new ApiResponse<CategoryResponseDto>
                {
                    Success = false,
                    Message = ex.Message,
                    Data = null
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating category");
                return StatusCode(500, new ApiResponse<CategoryResponseDto>
                {
                    Success = false,
                    Message = "Internal server error",
                    Data = null
                });
            }
        }

        [HttpPut("categories/{categoryId}")]
        public async Task<ActionResult<ApiResponse<CategoryResponseDto>>> UpdateCategory(
            int categoryId,
            [FromBody] UpdateCategoryDto dto)
        {
            try
            {
                if (!JwtUtil.IsAdmin(User))
                    return Forbid("Only administrators can access this resource");

                if (string.IsNullOrWhiteSpace(dto.Type))
                    return BadRequest(new ApiResponse<CategoryResponseDto>
                    {
                        Success = false,
                        Message = "Category type is required",
                        Data = null
                    });

                var categoryEntity = await _categoryService.UpdateCategoryAsync(categoryId, dto);

                if (categoryEntity == null)
                    return NotFound(new ApiResponse<CategoryResponseDto>
                    {
                        Success = false,
                        Message = $"Category with ID {categoryId} not found",
                        Data = null
                    });

                var categoryDto = new CategoryResponseDto
                {
                    CategoryId = categoryEntity.CategoryId,
                    Type = categoryEntity.Type ?? string.Empty,
                    Description = categoryEntity.Description,
                    Items = new List<ItemResponseDto>()
                };

                return Ok(new ApiResponse<CategoryResponseDto>
                {
                    Success = true,
                    Message = "Category updated successfully",
                    Data = categoryDto
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new ApiResponse<CategoryResponseDto>
                {
                    Success = false,
                    Message = ex.Message,
                    Data = null
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating category {categoryId}");
                return StatusCode(500, new ApiResponse<CategoryResponseDto>
                {
                    Success = false,
                    Message = "Internal server error",
                    Data = null
                });
            }
        }

        [HttpDelete("categories/{categoryId}")]
        public async Task<ActionResult<ApiResponse<object>>> DeleteCategory(int categoryId)
        {
            try
            {
                if (!JwtUtil.IsAdmin(User))
                    return Forbid("Only administrators can access this resource");

                var success = await _categoryService.DeleteCategoryAsync(categoryId);

                if (!success)
                    return NotFound(new ApiResponse<object>
                    {
                        Success = false,
                        Message = $"Category with ID {categoryId} not found",
                        Data = null
                    });

                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "Category deleted successfully",
                    Data = new { categoryId }
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Message = ex.Message,
                    Data = null
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting category {categoryId}");
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = "Internal server error",
                    Data = null
                });
            }
        }

        #endregion

        #region Items Management

        [HttpGet("items")]
        public async Task<ActionResult<ApiResponse<List<ItemResponseDto>>>> GetAllItems()
        {
            try
            {
                if (!JwtUtil.IsAdmin(User))
                    return Forbid("Only administrators can access this resource");

                var items = await _categoryService.GetAllItemsAsync();

                var itemDtos = items.Select(i => new ItemResponseDto
                {
                    ItemId = i.ItemId,
                    ItemName = i.ItemName ?? string.Empty,
                    CategoryId = i.CategoryId,
                    Category = i.Category != null
                        ? new CategoryResponseDto
                        {
                            CategoryId = i.Category.CategoryId,
                            Type = i.Category.Type ?? string.Empty,
                            Description = i.Category.Description,
                            Items = new List<ItemResponseDto>()
                        }
                        : null
                }).ToList();

                return Ok(new ApiResponse<List<ItemResponseDto>>
                {
                    Success = true,
                    Message = $"Retrieved {itemDtos.Count} items",
                    Data = itemDtos
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all items");
                return StatusCode(500, new ApiResponse<List<ItemResponseDto>>
                {
                    Success = false,
                    Message = "Internal server error",
                    Data = null
                });
            }
        }

        [HttpGet("items/category/{categoryId}")]
        public async Task<ActionResult<ApiResponse<List<ItemResponseDto>>>> GetItemsByCategory(int categoryId)
        {
            try
            {
                if (!JwtUtil.IsAdmin(User))
                    return Forbid("Only administrators can access this resource");

                var items = await _categoryService.GetItemsByCategoryAsync(categoryId);

                var itemDtos = items.Select(i => new ItemResponseDto
                {
                    ItemId = i.ItemId,
                    ItemName = i.ItemName ?? string.Empty,
                    CategoryId = i.CategoryId,
                    Category = i.Category != null
                        ? new CategoryResponseDto
                        {
                            CategoryId = i.Category.CategoryId,
                            Type = i.Category.Type ?? string.Empty,
                            Description = i.Category.Description,
                            Items = new List<ItemResponseDto>()
                        }
                        : null
                }).ToList();

                return Ok(new ApiResponse<List<ItemResponseDto>>
                {
                    Success = true,
                    Message = $"Retrieved {itemDtos.Count} items for category {categoryId}",
                    Data = itemDtos
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting items for category {categoryId}");
                return StatusCode(500, new ApiResponse<List<ItemResponseDto>>
                {
                    Success = false,
                    Message = "Internal server error",
                    Data = null
                });
            }
        }

        [HttpGet("items/{itemId}")]
        public async Task<ActionResult<ApiResponse<ItemResponseDto>>> GetItemById(int itemId)
        {
            try
            {
                if (!JwtUtil.IsAdmin(User))
                    return Forbid("Only administrators can access this resource");

                var item = await _categoryService.GetItemByIdAsync(itemId);

                if (item == null)
                    return NotFound(new ApiResponse<ItemResponseDto>
                    {
                        Success = false,
                        Message = $"Item with ID {itemId} not found",
                        Data = null
                    });

                var itemDto = new ItemResponseDto
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
                            Items = new List<ItemResponseDto>()
                        }
                        : null
                };

                return Ok(new ApiResponse<ItemResponseDto>
                {
                    Success = true,
                    Message = "Item found",
                    Data = itemDto
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting item {itemId}");
                return StatusCode(500, new ApiResponse<ItemResponseDto>
                {
                    Success = false,
                    Message = "Internal server error",
                    Data = null
                });
            }
        }

        // ------------------- NEW ITEM ENDPOINTS -------------------

        [HttpPost("items")]
        public async Task<ActionResult<ApiResponse<ItemResponseDto>>> CreateItem([FromBody] CreateItemDto dto)
        {
            try
            {
                if (!JwtUtil.IsAdmin(User))
                    return Forbid("Only administrators can access this resource");

                if (string.IsNullOrWhiteSpace(dto.ItemName) || dto.CategoryId <= 0)
                    return BadRequest(new ApiResponse<ItemResponseDto>
                    {
                        Success = false,
                        Message = "ItemName and CategoryId are required",
                        Data = null
                    });

                var item = await _categoryService.CreateItemAsync(dto);

                var itemDto = new ItemResponseDto
                {
                    ItemId = item.ItemId,
                    ItemName = item.ItemName,
                    CategoryId = item.CategoryId,
                    Category = null
                };

                return CreatedAtAction(nameof(GetItemById),
                    new { itemId = itemDto.ItemId },
                    new ApiResponse<ItemResponseDto>
                    {
                        Success = true,
                        Message = "Item created successfully",
                        Data = itemDto
                    });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating item");
                return StatusCode(500, new ApiResponse<ItemResponseDto>
                {
                    Success = false,
                    Message = "Internal server error",
                    Data = null
                });
            }
        }

        [HttpPut("items/{itemId}")]
        public async Task<ActionResult<ApiResponse<ItemResponseDto>>> UpdateItem(int itemId, [FromBody] UpdateItemDto dto)
        {
            try
            {
                if (!JwtUtil.IsAdmin(User))
                    return Forbid("Only administrators can access this resource");

                if (string.IsNullOrWhiteSpace(dto.ItemName) || dto.CategoryId <= 0)
                    return BadRequest(new ApiResponse<ItemResponseDto>
                    {
                        Success = false,
                        Message = "ItemName and CategoryId are required",
                        Data = null
                    });

                var item = await _categoryService.UpdateItemAsync(itemId, dto);
                if (item == null)
                    return NotFound(new ApiResponse<ItemResponseDto>
                    {
                        Success = false,
                        Message = $"Item with ID {itemId} not found",
                        Data = null
                    });

                var itemDto = new ItemResponseDto
                {
                    ItemId = item.ItemId,
                    ItemName = item.ItemName,
                    CategoryId = item.CategoryId,
                    Category = null
                };

                return Ok(new ApiResponse<ItemResponseDto>
                {
                    Success = true,
                    Message = "Item updated successfully",
                    Data = itemDto
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating item {itemId}");
                return StatusCode(500, new ApiResponse<ItemResponseDto>
                {
                    Success = false,
                    Message = "Internal server error",
                    Data = null
                });
            }
        }

        [HttpDelete("items/{itemId}")]
        public async Task<ActionResult<ApiResponse<object>>> DeleteItem(int itemId)
        {
            try
            {
                if (!JwtUtil.IsAdmin(User))
                    return Forbid("Only administrators can access this resource");

                var success = await _categoryService.DeleteItemAsync(itemId);

                if (!success)
                    return NotFound(new ApiResponse<object>
                    {
                        Success = false,
                        Message = $"Item with ID {itemId} not found",
                        Data = null
                    });

                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "Item deleted successfully",
                    Data = new { itemId }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting item {itemId}");
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = "Internal server error",
                    Data = null
                });
            }
        }

        #endregion
    }
}
