using AdminService.Models.DTOs;
using AdminService.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AdminService.Controllers
{
    [ApiController]
    [Route("api/admin")]
    [Authorize(Policy = "AdminOnly")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;
        private readonly ILogger<AdminController> _logger;

        public AdminController(IAdminService adminService, ILogger<AdminController> logger)
        {
            _adminService = adminService;
            _logger = logger;
        }

        // ================= DASHBOARD =================
        [HttpGet("stats")]
        public async Task<IActionResult> GetAdminStats()
        {
            try
            {
                var stats = await _adminService.GetDashboardStatsAsync();
                return Ok(stats); // ✅ IMPORTANT FIX
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching admin stats");
                return StatusCode(500, "Error fetching admin stats");
            }
        }

        // ================= USERS =================
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _adminService.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpGet("users/{userId:int}")]
        public async Task<IActionResult> GetUserById(int userId)
        {
            var user = await _adminService.GetUserByIdAsync(userId);
            return user == null ? NotFound() : Ok(user);
        }

        [HttpGet("users/role/{roleId:int}")]
        public async Task<IActionResult> GetUsersByRole(int roleId)
        {
            var users = await _adminService.GetUsersByRoleAsync(roleId);
            return Ok(users);
        }

        [HttpPatch("users/{userId:int}/status")]
        public async Task<IActionResult> UpdateUserStatus(
            int userId,
            [FromBody] UpdateStatusRequest request)
        {
            var updated = await _adminService.UpdateUserStatusAsync(userId, request.Status);
            return updated ? Ok() : NotFound();
        }

        // ================= STATISTICS =================
        [HttpGet("statistics")]
        public async Task<IActionResult> GetUserStatistics()
        {
            var stats = await _adminService.GetUserStatisticsAsync();
            return Ok(stats);
        }



        [HttpGet("statistics/total-users")]
        public async Task<IActionResult> GetTotalUsersCount()
        {
            var count = await _adminService.GetTotalUsersCountAsync();
            return Ok(count);
        }

        [HttpGet("statistics/active-users")]
        public async Task<IActionResult> GetActiveUsersCount()
        {
            var count = await _adminService.GetActiveUsersCountAsync();
            return Ok(count);
        }

        [HttpGet("statistics/role/{roleId:int}")]
        public async Task<IActionResult> GetUserCountByRole(int roleId)
        {
            var count = await _adminService.GetUserCountByRoleAsync(roleId);
            return Ok(count);
        }
    }

    public class UpdateStatusRequest
    {
        public int Status { get; set; }
    }
}
