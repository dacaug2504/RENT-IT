
using MySqlConnector;
using SearchService.Models;

namespace SearchService.Repositories
{
    public class CatalogRepository : ICatalogRepository
    {
        private readonly string _connectionString;

        public CatalogRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        // HOME PAGE Get all categories with item count
        public async Task<List<Category>> GetAllCategoriesAsync()
        {
            var categories = new List<Category>();

            var sql = @"
                SELECT 
                    c.category_id,
                    c.type,
                    c.description,
                    COUNT(i.item_id) as ItemCount
                FROM category c
                LEFT JOIN items i ON c.category_id = i.category_id
                GROUP BY c.category_id, c.type, c.description
                ORDER BY c.type";

            using (var connection = new MySqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                using (var command = new MySqlCommand(sql, connection))
                {
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            categories.Add(new Category
                            {
                                CategoryId = reader.GetInt32("category_id"),
                                Type = reader.GetString("type"),
                                Description = reader.IsDBNull(reader.GetOrdinal("description"))
                                    ? null
                                    : reader.GetString("description"),
                                ItemCount = reader.GetInt32("ItemCount")
                            });
                        }
                    }
                }
            }

            return categories;
        }

        // CATEGORY PAGE Get items by category with availability count
        public async Task<List<Item>> GetItemsByCategoryAsync(int categoryId)
        {
            var items = new List<Item>();

            var sql = @"
                SELECT 
                    i.item_id,
                    i.item_name,
                    i.category_id,
                    c.type as CategoryType,
                    COUNT(CASE WHEN oi.status = 'AVAILABLE' THEN 1 END) as AvailableCount
                FROM items i
                JOIN category c ON i.category_id = c.category_id
                LEFT JOIN owner_items oi ON i.item_id = oi.item_id
                WHERE i.category_id = @categoryId
                GROUP BY i.item_id, i.item_name, i.category_id, c.type
                ORDER BY i.item_name";

            using (var connection = new MySqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                using (var command = new MySqlCommand(sql, connection))
                {
                    command.Parameters.AddWithValue("@categoryId", categoryId);

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            items.Add(new Item
                            {
                                ItemId = reader.GetInt32("item_id"),
                                ItemName = reader.GetString("item_name"),
                                CategoryId = reader.GetInt32("category_id"),
                                CategoryType = reader.GetString("CategoryType"),
                                AvailableCount = reader.GetInt32("AvailableCount")
                            });
                        }
                    }
                }
            }

            return items;
        }

        // ITEM DETAIL PAGE  Get item details with all available listings
        public async Task<ItemDetail> GetItemDetailAsync(int itemId)
        {
            ItemDetail itemDetail = null;

            // First query Get item basic info
            var itemSql = @"
                SELECT 
                    i.item_id,
                    i.item_name,
                    i.category_id,
                    c.type as CategoryType,
                    c.description as CategoryDescription
                FROM items i
                JOIN category c ON i.category_id = c.category_id
                WHERE i.item_id = @itemId";

            using (var connection = new MySqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                // Get item info
                using (var command = new MySqlCommand(itemSql, connection))
                {
                    command.Parameters.AddWithValue("@itemId", itemId);

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            itemDetail = new ItemDetail
                            {
                                ItemId = reader.GetInt32("item_id"),
                                ItemName = reader.GetString("item_name"),
                                CategoryId = reader.GetInt32("category_id"),
                                CategoryType = reader.GetString("CategoryType"),
                                CategoryDescription = reader.IsDBNull(reader.GetOrdinal("CategoryDescription"))
                                    ? null
                                    : reader.GetString("CategoryDescription"),
                                AvailableListings = new List<OwnerItemListing>()
                            };
                        }
                    }
                }

                // If item found, get its listings
                if (itemDetail != null)
                {
                    var listingsSql = @"
                        SELECT 
                            oi.ot_id,
                            oi.brand,
                            oi.description,
                            oi.`condition`,
                            oi.rent_per_day,
                            oi.deposit_amt,
                            oi.status,
                            oi.user_id,
                            CONCAT(u.first_name, ' ', u.last_name) as OwnerName,
                            c.city_name,
                            s.state_name
                        FROM owner_items oi
                        JOIN user u ON oi.user_id = u.user_id
                        JOIN city c ON u.city_id = c.city_id
                        JOIN state s ON u.state_id = s.state_id
                        WHERE oi.item_id = @itemId 
                        AND oi.status = 'AVAILABLE'
                        ORDER BY oi.rent_per_day ASC";

                    using (var command = new MySqlCommand(listingsSql, connection))
                    {
                        command.Parameters.AddWithValue("@itemId", itemId);

                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                itemDetail.AvailableListings.Add(new OwnerItemListing
                                {
                                    OtId = reader.GetInt32("ot_id"),
                                    Brand = reader.GetString("brand"),
                                    Description = reader.GetString("description"),
                                    Condition = reader.GetString("condition"),
                                    RentPerDay = reader.GetInt32("rent_per_day"),
                                    DepositAmt = reader.GetInt32("deposit_amt"),
                                    Status = reader.GetString("status"),
                                    OwnerId = reader.GetInt32("user_id"),
                                    OwnerName = reader.GetString("OwnerName"),
                                    CityName = reader.GetString("city_name"),
                                    StateName = reader.GetString("state_name")
                                });
                            }
                        }
                    }
                }
            }

            return itemDetail;
        }

        // SEARCH Search items by name
        public async Task<SearchResult> SearchItemsAsync(string searchTerm)
        {
            var items = new List<Item>();

            var sql = @"
                SELECT 
                    i.item_id,
                    i.item_name,
                    i.category_id,
                    c.type as CategoryType,
                    COUNT(CASE WHEN oi.status = 'AVAILABLE' THEN 1 END) as AvailableCount
                FROM items i
                JOIN category c ON i.category_id = c.category_id
                LEFT JOIN owner_items oi ON i.item_id = oi.item_id
                WHERE i.item_name LIKE @searchTerm
                GROUP BY i.item_id, i.item_name, i.category_id, c.type
                ORDER BY i.item_name";

            using (var connection = new MySqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                using (var command = new MySqlCommand(sql, connection))
                {
                    command.Parameters.AddWithValue("@searchTerm", $"%{searchTerm}%");

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            items.Add(new Item
                            {
                                ItemId = reader.GetInt32("item_id"),
                                ItemName = reader.GetString("item_name"),
                                CategoryId = reader.GetInt32("category_id"),
                                CategoryType = reader.GetString("CategoryType"),
                                AvailableCount = reader.GetInt32("AvailableCount")
                            });
                        }
                    }
                }
            }

            return new SearchResult
            {
                Items = items,
                SearchTerm = searchTerm,
                TotalResults = items.Count
            };
        }

        // FILTER Get items by category and city
        public async Task<List<Item>> GetItemsByCategoryAndCityAsync(int categoryId, int cityId)
        {
            var items = new List<Item>();

            var sql = @"
                SELECT DISTINCT
                    i.item_id,
                    i.item_name,
                    i.category_id,
                    c.type as CategoryType,
                    COUNT(CASE WHEN oi.status = 'AVAILABLE' THEN 1 END) as AvailableCount
                FROM items i
                JOIN category c ON i.category_id = c.category_id
                LEFT JOIN owner_items oi ON i.item_id = oi.item_id
                LEFT JOIN user u ON oi.user_id = u.user_id
                WHERE i.category_id = @categoryId
                AND (u.city_id = @cityId OR u.city_id IS NULL)
                GROUP BY i.item_id, i.item_name, i.category_id, c.type
                HAVING AvailableCount > 0
                ORDER BY i.item_name";

            using (var connection = new MySqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                using (var command = new MySqlCommand(sql, connection))
                {
                    command.Parameters.AddWithValue("@categoryId", categoryId);
                    command.Parameters.AddWithValue("@cityId", cityId);

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            items.Add(new Item
                            {
                                ItemId = reader.GetInt32("item_id"),
                                ItemName = reader.GetString("item_name"),
                                CategoryId = reader.GetInt32("category_id"),
                                CategoryType = reader.GetString("CategoryType"),
                                AvailableCount = reader.GetInt32("AvailableCount")
                            });
                        }
                    }
                }
            }

            return items;
        }
    }
}

