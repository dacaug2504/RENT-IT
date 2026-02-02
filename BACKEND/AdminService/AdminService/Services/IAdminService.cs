using AdminService.Models;
using AdminService.Models.DTOs;

namespace AdminService.Services
{
    public interface IAdminService
    {
        // ================= AUTH =================
        Task<User?> AuthenticateUser(string email, string password);

        // ================= USER MANAGEMENT =================
        Task<List<UserDetailsDto>> GetAllUsersAsync();
        Task<UserDetailsDto?> GetUserByIdAsync(int userId);
        Task<List<UserDetailsDto>> GetUsersByRoleAsync(int roleId);
        Task<bool> UpdateUserStatusAsync(int userId, int status);

        // ================= STATISTICS =================
        Task<UserStatsDto> GetUserStatisticsAsync();
        Task<int> GetTotalUsersCountAsync();
        Task<int> GetActiveUsersCountAsync();
        Task<int> GetUserCountByRoleAsync(int roleId);

        // ================= DASHBOARD =================
        Task<DashboardStatsDto> GetDashboardStatsAsync();
    }
}
