using AdminService.Data;
using AdminService.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace AdminService.Services
{
    public class AdminStatsService : IAdminStatsService
    {
        private readonly AppDbContext _context;

        public AdminStatsService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<DashboardStatsDto> GetDashboardStatsAsync()
        {
            var totalUsers = await _context.Users.CountAsync();
            var activeUsers = await _context.Users.CountAsync(u => u.Status == 1);

            var adminsCount = await _context.Users
                .Include(u => u.Role)
                .CountAsync(u => u.Role!.RoleName == "ADMIN");

            var customersCount = await _context.Users
                .Include(u => u.Role)
                .CountAsync(u => u.Role!.RoleName == "CUSTOMER");

            var ownersCount = await _context.Users
                .Include(u => u.Role)
                .CountAsync(u => u.Role!.RoleName == "OWNER");

            var totalCategories = await _context.Categories.CountAsync();
            var totalItems = await _context.Items.CountAsync();

            return new DashboardStatsDto
            {
                TotalUsers = totalUsers,
                ActiveUsers = activeUsers,
                AdminsCount = adminsCount,
                CustomersCount = customersCount,
                OwnersCount = ownersCount,
                TotalCategories = totalCategories,
                TotalItems = totalItems
            };
        }
    }
}
