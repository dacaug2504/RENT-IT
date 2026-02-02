namespace AdminService.Models.DTOs
{
    /// <summary>
    /// DTO for user statistics dashboard
    /// </summary>
    public class UserStatsDto
    {
        public int TotalUsers { get; set; }
        public int ActiveUsers { get; set; }
        public int SuspendedUsers { get; set; }
        public int DisabledUsers { get; set; }
        public int CustomerCount { get; set; }
        public int OwnerCount { get; set; }
        public int AdminCount { get; set; }
        public Dictionary<string, int> UsersByRole { get; set; } = new();
        public Dictionary<string, int> UsersByStatus { get; set; } = new();
    }

    /// <summary>
    /// DTO for updating user account status
    /// </summary>
    public class UpdateUserStatusDto
    {
        public int Status { get; set; } // 1=ACTIVE, 2=SUSPENDED, 3=DISABLED

        public bool IsValid()
        {
            return Status >= 1 && Status <= 3;
        }
    }

    /// <summary>
    /// DTO for creating a new category
    /// </summary>
    public class CreateCategoryDto
    {
        public string Type { get; set; } = string.Empty;
        public string? Description { get; set; }
    }

    /// <summary>
    /// DTO for updating an existing category
    /// </summary>
    public class UpdateCategoryDto
    {
        public string Type { get; set; } = string.Empty;
        public string? Description { get; set; }
    }

    /// <summary>
    /// DTO for creating a new item
    /// </summary>
    public class CreateItemDto
    {
        public string ItemName { get; set; } = string.Empty;
        public int CategoryId { get; set; }
    }

    /// <summary>
    /// DTO for updating an existing item
    /// </summary>
    public class UpdateItemDto
    {
        public string ItemName { get; set; } = string.Empty;
        public int CategoryId { get; set; }
    }

    /// <summary>
    /// DTO for user details with related information
    /// </summary>
    public class UserDetailsDto
    {
        public int UserId { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public long PhoneNo { get; set; }
        public string? Address { get; set; }
        public int? Status { get; set; }
        public string? StatusName { get; set; }
        public DateTime? DateTime { get; set; }

        // Related entities
        public string? RoleName { get; set; }
        public string? StateName { get; set; }
        public string? CityName { get; set; }
    }

    /// <summary>
    /// Generic API response wrapper
    /// </summary>
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; }
    }
}