using BillingService.Models;
using BillingService.Models.DTOs;

namespace BillingService.Services
{
    public interface IBillingService
    {
        Task<IEnumerable<BillResponseDTO>> GetAllBillsAsync();
        Task<IEnumerable<BillResponseDTO>> GetBillsByCustomerIdAsync(int customerId);
        Task<IEnumerable<BillResponseDTO>> GetBillsByOwnerIdAsync(int ownerId);
        Task<BillResponseDTO?> GetBillByIdAsync(int billNo);
        Task<BillResponseDTO> CreateBillAsync(CreateBillDTO createBillDto);
    }
}