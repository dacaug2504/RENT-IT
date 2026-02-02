using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace BillingService.Attributes
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class AuthorizeAttribute : Attribute, IAuthorizationFilter
    {
        private readonly string[]? _allowedRoles;

        public AuthorizeAttribute(params string[] allowedRoles)
        {
            _allowedRoles = allowedRoles.Length > 0 ? allowedRoles : null;
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var userId = context.HttpContext.Items["UserId"];
            var userRole = context.HttpContext.Items["Role"]?.ToString();

            // Check if user is authenticated
            if (userId == null)
            {
                context.Result = new JsonResult(new { message = "Unauthorized - No valid token" })
                {
                    StatusCode = StatusCodes.Status401Unauthorized
                };
                return;
            }

            // Check if specific roles are required
            if (_allowedRoles != null && _allowedRoles.Length > 0)
            {
                if (string.IsNullOrEmpty(userRole) || !_allowedRoles.Contains(userRole, StringComparer.OrdinalIgnoreCase))
                {
                    context.Result = new JsonResult(new { message = $"Forbidden - Required role: {string.Join(", ", _allowedRoles)}" })
                    {
                        StatusCode = StatusCodes.Status403Forbidden
                    };
                    return;
                }
            }
        }
    }
}