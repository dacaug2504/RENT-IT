using Microsoft.AspNetCore.Authorization;

namespace AdminService.Authorization
{
    // Custom authorization requirement for Admin role
    public class AdminRoleRequirement : IAuthorizationRequirement
    {
        public string RoleName { get; } = "ADMIN";
    }

    // Authorization handler for Admin role
    public class AdminRoleHandler : AuthorizationHandler<AdminRoleRequirement>
    {
        protected override Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            AdminRoleRequirement requirement)
        {
            // Check if user has the admin role claim
            var roleClaim = context.User.FindFirst(System.Security.Claims.ClaimTypes.Role);

            if (roleClaim != null && roleClaim.Value.ToUpper() == requirement.RoleName)
            {
                context.Succeed(requirement);
            }

            return Task.CompletedTask;
        }
    }
}