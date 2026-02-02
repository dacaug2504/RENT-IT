using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BillingService.Middleware
{
    public class JwtMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IConfiguration _configuration;
        private readonly ILogger<JwtMiddleware> _logger;

        public JwtMiddleware(RequestDelegate next, IConfiguration configuration, ILogger<JwtMiddleware> logger)
        {
            _next = next;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

            if (token != null)
            {
                AttachUserToContext(context, token);
            }

            await _next(context);
        }

        private void AttachUserToContext(HttpContext context, string token)
        {
            try
            {
                var secret = _configuration["JwtSettings:Secret"];
                if (string.IsNullOrEmpty(secret))
                {
                    _logger.LogError("JWT Secret is not configured");
                    return;
                }

                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes(secret);

                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;

                // Extract userId from subject claim
                var userIdClaim = jwtToken.Subject;
                if (int.TryParse(userIdClaim, out int userId))
                {
                    context.Items["UserId"] = userId;
                }

                // Extract role from custom claim
                var roleClaim = jwtToken.Claims.FirstOrDefault(x => x.Type == "role")?.Value;
                if (!string.IsNullOrEmpty(roleClaim))
                {
                    context.Items["Role"] = roleClaim;
                }

                _logger.LogInformation("JWT validated successfully for UserId: {UserId}, Role: {Role}", userId, roleClaim);
            }
            catch (SecurityTokenExpiredException)
            {
                _logger.LogWarning("JWT token has expired");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "JWT validation failed");
            }
        }
    }

    // Extension method to add middleware to pipeline
    public static class JwtMiddlewareExtensions
    {
        public static IApplicationBuilder UseJwtMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<JwtMiddleware>();
        }
    }
}