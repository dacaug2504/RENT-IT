using AdminService.Models.DTOs;
using AdminService.Services;
using AdminService.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AdminService.Controllers
{
    [ApiController]
    [Route("api/admin")]
    [Authorize]
    public class AdminStatsController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminStatsController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet("dashboard-stats")]
        public async Task<ActionResult<ApiResponse<DashboardStatsDto>>> GetDashboardStats()
        {
            if (!JwtUtil.IsAdmin(User))
                return Forbid("Only admins can access this resource");

            var stats = await _adminService.GetDashboardStatsAsync();

            return Ok(new ApiResponse<DashboardStatsDto>
            {
                Success = true,
                Message = "Dashboard statistics retrieved successfully",
                Data = stats
            });
        }
    }
}
