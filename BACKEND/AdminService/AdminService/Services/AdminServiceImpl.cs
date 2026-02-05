using AdminService.Data;
using AdminService.Models;
using AdminService.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace AdminService.Services
{
    public class AdminServiceImpl : IAdminService
    {
        private readonly AppDbContext _context;

        public AdminServiceImpl(AppDbContext context)
        {
            _context = context;
        }

        // ================= AUTH =================
        public async Task<User?> AuthenticateUser(string email, string password)
        {
            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Email == email);

            if (user == null) return null;

            return BCrypt.Net.BCrypt.Verify(password, user.Password)
                ? user
                : null;
        }

        // ================= USERS =================
        public async Task<List<UserDetailsDto>> GetAllUsersAsync()
        {
            return await _context.Users
                .Include(u => u.Role)
                .Select(u => new UserDetailsDto
                {
                    UserId = u.UserId,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    Email = u.Email,
                    PhoneNo = u.PhoneNo,
                    Status = u.Status,
                    RoleName = u.Role!.RoleName,
                    StatusName = GetStatusName(u.Status)
                })
                .ToListAsync();
        }

        public async Task<UserDetailsDto?> GetUserByIdAsync(int userId)
        {
            return await _context.Users
                .Include(u => u.Role)
                .Where(u => u.UserId == userId)
                .Select(u => new UserDetailsDto
                {
                    UserId = u.UserId,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    Email = u.Email,
                    PhoneNo = u.PhoneNo,
                    Status = u.Status,
                    RoleName = u.Role!.RoleName,
                    StatusName = GetStatusName(u.Status)
                })
                .FirstOrDefaultAsync();
        }

        public async Task<List<UserDetailsDto>> GetUsersByRoleAsync(int roleId)
        {
            return await _context.Users
                .Where(u => u.RoleId == roleId)
                .Include(u => u.Role)
                .Select(u => new UserDetailsDto
                {
                    UserId = u.UserId,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    Email = u.Email,
                    RoleName = u.Role!.RoleName
                })
                .ToListAsync();
        }

        public async Task<bool> UpdateUserStatusAsync(int userId, int status)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return false;

            user.Status = status;
            await _context.SaveChangesAsync();
            return true;
        }

        // ================= BASIC STATS =================
        public Task<int> GetTotalUsersCountAsync()
            => _context.Users.CountAsync();

        public Task<int> GetActiveUsersCountAsync()
            => _context.Users.CountAsync(u => u.Status == 1);

        public Task<int> GetUserCountByRoleAsync(int roleId)
            => _context.Users.CountAsync(u => u.RoleId == roleId);

        public async Task<UserStatsDto> GetUserStatisticsAsync()
        {
            return new UserStatsDto
            {
                TotalUsers = await _context.Users.CountAsync(),
                ActiveUsers = await _context.Users.CountAsync(u => u.Status == 1)
            };
        }

        // ================= DASHBOARD STATS (IMPORTANT) =================
        public async Task<DashboardStatsDto> GetDashboardStatsAsync()
        {
            return new DashboardStatsDto
            {
                // Users
                TotalUsers = await _context.Users.CountAsync(),
                ActiveUsers = await _context.Users.CountAsync(u => u.Status == 1),

                // Roles (using REAL role IDs)
                AdminsCount = await _context.Users.CountAsync(u => u.RoleId == 1),
                OwnersCount = await _context.Users.CountAsync(u => u.RoleId == 2),
                CustomersCount = await _context.Users.CountAsync(u => u.RoleId == 3),

                // Categories & Items
                TotalCategories = await _context.Categories.CountAsync(),
                TotalItems = await _context.Items.CountAsync()
            };
        }




        // ================= UTIL =================
        private static string GetStatusName(int? status)
        {
            return status switch
            {
                1 => "ACTIVE",
                2 => "SUSPENDED",
                3 => "DISABLED",
                _ => "UNKNOWN"
            };
        }
    }
}
