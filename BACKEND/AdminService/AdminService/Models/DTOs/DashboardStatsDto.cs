namespace AdminService.Models.DTOs
{
    public class DashboardStatsDto
    {
        public int TotalUsers { get; set; }
        public int ActiveUsers { get; set; }

        public int AdminsCount { get; set; }
        public int CustomersCount { get; set; }
        public int OwnersCount { get; set; }

        public int TotalCategories { get; set; }
        public int TotalItems { get; set; }
    }
}
