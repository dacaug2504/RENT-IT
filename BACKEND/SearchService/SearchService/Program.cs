using SearchService.Repositories;
using SearchService.Services;
using System.Text.Json.Serialization;
using Steeltoe.Discovery.Client;
using Steeltoe.Discovery.Eureka;

namespace SearchService
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container
            builder.Services.AddControllers().AddJsonOptions(x =>
                x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var connectionString = builder.Configuration.GetConnectionString("RentItDb");

            // Register Repository and Service
            builder.Services.AddScoped<ICatalogRepository>(provider =>
                new CatalogRepository(connectionString));
            builder.Services.AddScoped<ICatalogService, CatalogService>();

            // Add Eureka Discovery
            builder.Services.AddServiceDiscovery(o => o.UseEureka());



            var app = builder.Build();

            // Configure the HTTP request pipeline
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            // ✅ REMOVED: app.UseHttpsRedirection() - Service runs HTTP only

            app.UseAuthorization();
            app.MapControllers();
            app.Run();
        }
    }
}