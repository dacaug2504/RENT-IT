using AdminService.Models.DTOs;

namespace AdminService.Services
{
    public interface IAdminStatsService
    {
        Task<DashboardStatsDto> GetDashboardStatsAsync();
    }
}
