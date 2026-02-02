using Microsoft.EntityFrameworkCore;
using AdminService.Data;
using AdminService.Models;
using AdminService.Models.DTOs;
using AdminService.Extensions;

namespace AdminService.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<CategoryService> _logger;

        public CategoryService(AppDbContext context, ILogger<CategoryService> logger)
        {
            _context = context;
            _logger = logger;
        }

        // ===================== CATEGORY =====================

        public async Task<List<CategoryResponseDto>> GetAllCategoriesAsync()
        {
            var categories = await _context.Categories
                .Include(c => c.Items)
                .ToListAsync();

            return categories.Select(c => c.ToDto()).ToList();
        }

        public async Task<CategoryResponseDto?> GetCategoryByIdAsync(int categoryId)
        {
            var category = await _context.Categories
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.CategoryId == categoryId);

            return category?.ToDto();
        }

        public async Task<Category> CreateCategoryAsync(CreateCategoryDto dto)
        {
            var exists = await _context.Categories
                .AnyAsync(c => c.Type.ToLower() == dto.Type.ToLower());

            if (exists)
                throw new InvalidOperationException("Category already exists");

            var category = new Category
            {
                Type = dto.Type,
                Description = dto.Description
            };

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return category;
        }

        public async Task<Category?> UpdateCategoryAsync(int categoryId, UpdateCategoryDto dto)
        {
            var category = await _context.Categories.FindAsync(categoryId);
            if (category == null) return null;

            category.Type = dto.Type;
            category.Description = dto.Description;

            await _context.SaveChangesAsync();
            return category;
        }

        public async Task<bool> DeleteCategoryAsync(int categoryId)
        {
            var category = await _context.Categories
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.CategoryId == categoryId);

            if (category == null) return false;

            if (category.Items.Any())
                throw new InvalidOperationException("Category has items");

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
            return true;
        }

        // ===================== ITEMS =====================

        public async Task<List<Items>> GetAllItemsAsync()
        {
            return await _context.Items
                .Include(i => i.Category)
                .ToListAsync();
        }

        public async Task<List<Items>> GetItemsByCategoryAsync(int categoryId)
        {
            return await _context.Items
                .Include(i => i.Category)
                .Where(i => i.CategoryId == categoryId)
                .ToListAsync();
        }

        public async Task<Items?> GetItemByIdAsync(int itemId)
        {
            return await _context.Items
                .Include(i => i.Category)
                .FirstOrDefaultAsync(i => i.ItemId == itemId);
        }

        public async Task<Items> CreateItemAsync(CreateItemDto dto)
        {
            var item = new Items
            {
                ItemName = dto.ItemName,
                CategoryId = dto.CategoryId
            };

            _context.Items.Add(item);
            await _context.SaveChangesAsync();
            return item;
        }

        public async Task<Items?> UpdateItemAsync(int itemId, UpdateItemDto dto)
        {
            var item = await _context.Items.FindAsync(itemId);
            if (item == null) return null;

            item.ItemName = dto.ItemName;
            item.CategoryId = dto.CategoryId;

            await _context.SaveChangesAsync();
            return item;
        }

        public async Task<bool> DeleteItemAsync(int itemId)
        {
            var item = await _context.Items.FindAsync(itemId);
            if (item == null) return false;

            _context.Items.Remove(item);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
