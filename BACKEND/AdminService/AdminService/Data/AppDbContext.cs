using Microsoft.EntityFrameworkCore;
using AdminService.Models;

namespace AdminService.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<State> States { get; set; }
        public DbSet<City> Cities { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Items> Items { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ================= USER =================
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("user");
                entity.HasKey(u => u.UserId);

                entity.HasOne(u => u.Role)
                      .WithMany(r => r.Users)
                      .HasForeignKey(u => u.RoleId)
                      .HasConstraintName("fk_user_role")
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(u => u.State)
                      .WithMany(s => s.Users)
                      .HasForeignKey(u => u.StateId)
                      .HasConstraintName("fk_user_state")
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(u => u.City)
                      .WithMany(c => c.Users)
                      .HasForeignKey(u => u.CityId)
                      .HasConstraintName("fk_user_city")
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // ================= ROLE =================
            modelBuilder.Entity<Role>(entity =>
            {
                entity.ToTable("role");
                entity.HasKey(r => r.RoleId);
            });

            // ================= STATE =================
            modelBuilder.Entity<State>(entity =>
            {
                entity.ToTable("state");
                entity.HasKey(s => s.StateId);
            });

            // ================= CITY =================
            modelBuilder.Entity<City>(entity =>
            {
                entity.ToTable("city");
                entity.HasKey(c => c.CityId);

                entity.HasOne(c => c.State)
                      .WithMany(s => s.Cities)
                      .HasForeignKey(c => c.StateId)
                      .HasConstraintName("fk_city_state")
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // ================= CATEGORY =================
            modelBuilder.Entity<Category>(entity =>
            {
                entity.ToTable("category");
                entity.HasKey(c => c.CategoryId);
                entity.HasIndex(c => c.Type).IsUnique();
            });

            // ================= ITEMS =================
            modelBuilder.Entity<Items>(entity =>
            {
                entity.ToTable("items");
                entity.HasKey(i => i.ItemId);

                entity.HasOne(i => i.Category)
                      .WithMany(c => c.Items)
                      .HasForeignKey(i => i.CategoryId)
                      .HasConstraintName("fk_items_category")
                      .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}
