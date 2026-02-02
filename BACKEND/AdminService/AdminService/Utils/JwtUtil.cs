using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace AdminService.Utils
{
    public static class JwtUtil
    {
        /// <summary>
        /// Extracts the role claim from a JWT token string
        /// </summary>
        public static string? GetRoleFromToken(string token)
        {
            try
            {
                var handler = new JwtSecurityTokenHandler();
                var jwt = handler.ReadJwtToken(token);

                return jwt.Claims
                    .FirstOrDefault(c =>
                        c.Type == ClaimTypes.Role ||
                        c.Type == "role")?.Value;
            }
            catch
            {
                return null;
            }
        }

        /// <summary>
        /// Checks if the ClaimsPrincipal has Admin role
        /// </summary>
        public static bool IsAdmin(ClaimsPrincipal? user)
        {
            if (user == null || !user.Identity?.IsAuthenticated == true)
                return false;

            // Look for the Role claim
            var roleClaim = user.Claims.FirstOrDefault(c =>
                c.Type == ClaimTypes.Role || c.Type == "role");

            return roleClaim != null && roleClaim.Value.ToUpper() == "ADMIN";
        }
    }
}
