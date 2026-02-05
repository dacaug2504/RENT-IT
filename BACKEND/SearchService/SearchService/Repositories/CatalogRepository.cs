
using MySqlConnector;
using SearchService.Models;
using System.Data;

namespace SearchService.Repositories
{
    public class CatalogRepository : ICatalogRepository
    {
        private readonly string _connectionString;

        public CatalogRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        private MySqlConnection CreateConnection()
        {
            return new MySqlConnection(_connectionString);
        }

        // ============================
        // HOME PAGE: Categories
        // ============================
        public async Task<List<Category>> GetAllCategoriesAsync()
        {
            var categories = new List<Category>();

            using var conn = CreateConnection();
            await conn.OpenAsync();

            var sql = @"
                SELECT 
                    c.category_id,
                    c.type,
                    c.description,
                    COUNT(i.item_id) AS item_count
                FROM category c
                LEFT JOIN items i ON c.category_id = i.category_id
                GROUP BY c.category_id, c.type, c.description
                ORDER BY c.type";

            using var cmd = new MySqlCommand(sql, conn);
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                categories.Add(new Category
                {
                    CategoryId = reader.GetInt32("category_id"),
                    Type = reader.GetString("type"),
                    Description = reader.GetString("description"),
                    ItemCount = reader.GetInt32("item_count")
                });
            }

            return categories;
        }

        // ============================
        // CATEGORY PAGE: Items by Category
        // ============================
        public async Task<List<Item>> GetItemsByCategoryAsync(int categoryId)
        {
            var items = new List<Item>();

            using var conn = CreateConnection();
            await conn.OpenAsync();

            var sql = @"
                SELECT 
                    i.item_id,
                    i.item_name,
                    i.category_id,
                    c.type AS category_type,
                    COUNT(CASE WHEN oi.status = 'AVAILABLE' THEN 1 END) AS available_count
                FROM items i
                JOIN category c ON i.category_id = c.category_id
                LEFT JOIN owner_items oi ON i.item_id = oi.item_id
                WHERE i.category_id = @CategoryId
                GROUP BY i.item_id, i.item_name, i.category_id, c.type
                ORDER BY i.item_name";

            using var cmd = new MySqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("@CategoryId", categoryId);

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                items.Add(new Item
                {
                    ItemId = reader.GetInt32("item_id"),
                    ItemName = reader.GetString("item_name"),
                    CategoryId = reader.GetInt32("category_id"),
                    CategoryType = reader.GetString("category_type"),
                    AvailableCount = reader.GetInt32("available_count")
                });
            }

            return items;
        }

        // ============================
        // ITEM DETAIL PAGE
        // ============================
        public async Task<ItemDetail?> GetItemDetailAsync(int itemId)
        {
            using var conn = CreateConnection();
            await conn.OpenAsync();

            ItemDetail? item = null;

            var itemSql = @"
                SELECT 
                    i.item_id,
                    i.item_name,
                    i.category_id,
                    c.type,
                    c.description
                FROM items i
                JOIN category c ON i.category_id = c.category_id
                WHERE i.item_id = @ItemId";

            using (var cmd = new MySqlCommand(itemSql, conn))
            {
                cmd.Parameters.AddWithValue("@ItemId", itemId);
                using var reader = await cmd.ExecuteReaderAsync();

                if (await reader.ReadAsync())
                {
                    item = new ItemDetail
                    {
                        ItemId = reader.GetInt32("item_id"),
                        ItemName = reader.GetString("item_name"),
                        CategoryId = reader.GetInt32("category_id"),
                        CategoryType = reader.GetString("type"),
                        CategoryDescription = reader.GetString("description"),
                        AvailableListings = new List<OwnerItemListing>()
                    };
                }
            }

            if (item == null) return null;

            var listingSql = @"
                SELECT 
                    oi.ot_id,
                    oi.brand,
                    oi.description,
                    oi.`condition_type`,
                    oi.rent_per_day,
                    oi.deposit_amt,
                    oi.status,
                    oi.user_id,
                    CONCAT(u.first_name, ' ', u.last_name) AS owner_name,
                    c.city_name,
                    s.state_name
                FROM owner_items oi
                JOIN user u ON oi.user_id = u.user_id
                JOIN city c ON u.city_id = c.city_id
                JOIN state s ON u.state_id = s.state_id
                WHERE oi.item_id = @ItemId
                AND oi.status = 'AVAILABLE'
                ORDER BY oi.rent_per_day";

            using var listCmd = new MySqlCommand(listingSql, conn);
            listCmd.Parameters.AddWithValue("@ItemId", itemId);

            using var listReader = await listCmd.ExecuteReaderAsync();
            while (await listReader.ReadAsync())
            {
                item.AvailableListings.Add(new OwnerItemListing
                {
                    OtId = listReader.GetInt32("ot_id"),
                    Brand = listReader.GetString("brand"),
                    Description = listReader.GetString("description"),
                    Condition = listReader.GetString("condition_type"),
                    RentPerDay = listReader.GetInt32("rent_per_day"),
                    DepositAmt = listReader.GetInt32("deposit_amt"),
                    Status = listReader.GetString("status"),
                    OwnerId = listReader.GetInt32("user_id"),
                    OwnerName = listReader.GetString("owner_name"),
                    CityName = listReader.GetString("city_name"),
                    StateName = listReader.GetString("state_name")
                });
            }

            return item;
        }

        // ============================
        // SEARCH
        // ============================
        public async Task<SearchResult> SearchItemsAsync(string searchTerm)
        {
            var items = new List<Item>();

            using var conn = CreateConnection();
            await conn.OpenAsync();

            var sql = @"
                SELECT DISTINCT
                    i.item_id,
                    i.item_name,
                    i.category_id,
                    c.type AS category_type,
                    COUNT(CASE WHEN oi.status = 'AVAILABLE' THEN 1 END) AS available_count
                FROM items i
                JOIN category c ON i.category_id = c.category_id
                LEFT JOIN owner_items oi ON i.item_id = oi.item_id
                WHERE i.item_name LIKE @Search
                   OR c.type LIKE @Search
                   OR c.description LIKE @Search
                   OR oi.brand LIKE @Search
                   OR oi.description LIKE @Search
                GROUP BY i.item_id, i.item_name, i.category_id, c.type
                ORDER BY i.item_name";

            using var cmd = new MySqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("@Search", $"%{searchTerm}%");

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                items.Add(new Item
                {
                    ItemId = reader.GetInt32("item_id"),
                    ItemName = reader.GetString("item_name"),
                    CategoryId = reader.GetInt32("category_id"),
                    CategoryType = reader.GetString("category_type"),
                    AvailableCount = reader.GetInt32("available_count")
                });
            }

            return new SearchResult
            {
                Items = items,
                SearchTerm = searchTerm,
                TotalResults = items.Count
            };
        }

        // ============================
        // FILTER: Category + City
        // ============================
        public async Task<List<Item>> GetItemsByCategoryAndCityAsync(int categoryId, int cityId)
        {
            var items = new List<Item>();

            using var conn = CreateConnection();
            await conn.OpenAsync();

            var sql = @"
                SELECT DISTINCT
                    i.item_id,
                    i.item_name,
                    i.category_id,
                    c.type AS category_type,
                    COUNT(CASE WHEN oi.status = 'AVAILABLE' THEN 1 END) AS available_count
                FROM items i
                JOIN category c ON i.category_id = c.category_id
                LEFT JOIN owner_items oi ON i.item_id = oi.item_id
                LEFT JOIN user u ON oi.user_id = u.user_id
                WHERE i.category_id = @CategoryId
                AND (u.city_id = @CityId OR u.city_id IS NULL)
                GROUP BY i.item_id, i.item_name, i.category_id, c.type
                HAVING available_count > 0
                ORDER BY i.item_name";

            using var cmd = new MySqlCommand(sql, conn);
            cmd.Parameters.AddWithValue("@CategoryId", categoryId);
            cmd.Parameters.AddWithValue("@CityId", cityId);

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                items.Add(new Item
                {
                    ItemId = reader.GetInt32("item_id"),
                    ItemName = reader.GetString("item_name"),
                    CategoryId = reader.GetInt32("category_id"),
                    CategoryType = reader.GetString("category_type"),
                    AvailableCount = reader.GetInt32("available_count")
                });
            }

            return items;
        }

    }
}
