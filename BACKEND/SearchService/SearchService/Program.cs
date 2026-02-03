using SearchService.Repositories;
using SearchService.Services;
using System.Text.Json.Serialization;
using Steeltoe.Discovery.Client;  // ✅ ADD THIS
using Steeltoe.Discovery.Eureka;  // ✅ ADD THIS

namespace SearchService
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllers().AddJsonOptions(x =>
                x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var connectionString = builder.Configuration.GetConnectionString("RentItDb");

            // Register Repository and Service with Dependency Injection
            builder.Services.AddScoped<ICatalogRepository>(provider =>
                new CatalogRepository(connectionString));
            builder.Services.AddScoped<ICatalogService, CatalogService>();

            // ✅ ADD EUREKA DISCOVERY CLIENT
            builder.Services.AddServiceDiscovery(o => o.UseEureka());

            // CORS Configuration - REMOVE THIS (Gateway will handle CORS)
            // Comment out or delete the CORS configuration
            /*
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReact", policy =>
                {
                    policy
                        .WithOrigins("http://localhost:3000", "https://localhost:3000")
                        .AllowAnyOrigin()
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });
            */

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            // ✅ REMOVE THIS LINE (Gateway handles CORS)
            // app.UseCors("AllowReact");  

            app.UseHttpsRedirection();
            app.UseAuthorization();
            app.MapControllers();
            app.Run();
        }
    }
}