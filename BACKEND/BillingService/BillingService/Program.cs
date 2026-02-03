using Microsoft.EntityFrameworkCore;
using BillingService.Data;
using BillingService.Services;
using BillingService.Middleware;
using Steeltoe.Discovery.Client;
using Steeltoe.Discovery.Eureka;

var builder = WebApplication.CreateBuilder(args);

// ========== ALL SERVICE REGISTRATIONS GO HERE ==========

builder.Services.AddControllers();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySQL(connectionString ?? throw new InvalidOperationException("Connection string not found")));

builder.Services.AddScoped<IBillingService, BillingService.Services.BillingService>();

// ✅ MOVE THIS LINE HERE (BEFORE builder.Build())
builder.Services.AddServiceDiscovery(o => o.UseEureka());

var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
    ?? new[] { "http://localhost:3000" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "RentIt Billing Service API",
        Version = "v1",
        Description = "Billing Service for RentIt Application"
    });

    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

// ========== END OF SERVICE REGISTRATIONS ==========
// ========== NOW BUILD THE APP ==========

var app = builder.Build();

// ========== MIDDLEWARE PIPELINE (AFTER BUILD) ==========

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Billing Service API V1");
    c.RoutePrefix = "swagger";
});

app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";

        var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
        logger.LogError("Unhandled exception occurred");

        await context.Response.WriteAsJsonAsync(new
        {
            message = "An unexpected error occurred",
            timestamp = DateTime.UtcNow
        });
    });
});

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseJwtMiddleware();
app.UseAuthorization();
app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        var canConnect = context.Database.CanConnect();

        var logger = services.GetRequiredService<ILogger<Program>>();
        if (canConnect)
        {
            logger.LogInformation("✅ Successfully connected to MySQL database");
        }
        else
        {
            logger.LogWarning("⚠️  Could not connect to MySQL database");
        }
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "❌ Error connecting to database during startup");
    }
}

app.Run();

Console.WriteLine("🚀 Billing Service is running...");