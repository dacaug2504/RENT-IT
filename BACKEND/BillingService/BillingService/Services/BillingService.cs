using Microsoft.EntityFrameworkCore;
using BillingService.Data;
using BillingService.Models;
using BillingService.Models.DTOs;

namespace BillingService.Services
{
    public class BillingService : IBillingService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<BillingService> _logger;

        public BillingService(AppDbContext context, ILogger<BillingService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<BillResponseDTO>> GetAllBillsAsync()
        {
            try
            {
                var bills = await _context.Bills
                    .Include(b => b.Customer)
                        .ThenInclude(c => c!.Role)
                    .Include(b => b.Customer)
                        .ThenInclude(c => c!.City)
                    .Include(b => b.Customer)
                        .ThenInclude(c => c!.State)
                    .Include(b => b.Owner)
                        .ThenInclude(o => o!.Role)
                    .Include(b => b.Owner)
                        .ThenInclude(o => o!.City)
                    .Include(b => b.Owner)
                        .ThenInclude(o => o!.State)
                    .Include(b => b.OwnerItem)
                    .ToListAsync();

                return bills.Select(MapToDTO);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all bills");
                throw;
            }
        }

        public async Task<IEnumerable<BillResponseDTO>> GetBillsByCustomerIdAsync(int customerId)
        {
            try
            {
                var bills = await _context.Bills
                    .Include(b => b.Customer)
                        .ThenInclude(c => c!.Role)
                    .Include(b => b.Customer)
                        .ThenInclude(c => c!.City)
                    .Include(b => b.Customer)
                        .ThenInclude(c => c!.State)
                    .Include(b => b.Owner)
                        .ThenInclude(o => o!.Role)
                    .Include(b => b.Owner)
                        .ThenInclude(o => o!.City)
                    .Include(b => b.Owner)
                        .ThenInclude(o => o!.State)
                    .Include(b => b.OwnerItem)
                    .Where(b => b.CustomerId == customerId)
                    .ToListAsync();

                return bills.Select(MapToDTO);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving bills for customer {CustomerId}", customerId);
                throw;
            }
        }

        public async Task<IEnumerable<BillResponseDTO>> GetBillsByOwnerIdAsync(int ownerId)
        {
            try
            {
                var bills = await _context.Bills
                    .Include(b => b.Customer)
                        .ThenInclude(c => c!.Role)
                    .Include(b => b.Customer)
                        .ThenInclude(c => c!.City)
                    .Include(b => b.Customer)
                        .ThenInclude(c => c!.State)
                    .Include(b => b.Owner)
                        .ThenInclude(o => o!.Role)
                    .Include(b => b.Owner)
                        .ThenInclude(o => o!.City)
                    .Include(b => b.Owner)
                        .ThenInclude(o => o!.State)
                    .Include(b => b.OwnerItem)
                    .Where(b => b.OwnerId == ownerId)
                    .ToListAsync();

                return bills.Select(MapToDTO);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving bills for owner {OwnerId}", ownerId);
                throw;
            }
        }

        public async Task<BillResponseDTO?> GetBillByIdAsync(int billNo)
        {
            try
            {
                var bill = await _context.Bills
                    .Include(b => b.Customer)
                        .ThenInclude(c => c!.Role)
                    .Include(b => b.Customer)
                        .ThenInclude(c => c!.City)
                    .Include(b => b.Customer)
                        .ThenInclude(c => c!.State)
                    .Include(b => b.Owner)
                        .ThenInclude(o => o!.Role)
                    .Include(b => b.Owner)
                        .ThenInclude(o => o!.City)
                    .Include(b => b.Owner)
                        .ThenInclude(o => o!.State)
                    .Include(b => b.OwnerItem)
                    .FirstOrDefaultAsync(b => b.BillNo == billNo);

                return bill != null ? MapToDTO(bill) : null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving bill {BillNo}", billNo);
                throw;
            }
        }

        public async Task<BillResponseDTO> CreateBillAsync(CreateBillDTO createBillDto)
        {
            try
            {
                var customer = await _context.Users.FindAsync(createBillDto.CustomerId)
                               ?? throw new ArgumentException($"Customer with ID {createBillDto.CustomerId} not found");

                var owner = await _context.Users.FindAsync(createBillDto.OwnerId)
                            ?? throw new ArgumentException($"Owner with ID {createBillDto.OwnerId} not found");

                var item = await _context.OwnerItems.FindAsync(createBillDto.ItemId)
                           ?? throw new ArgumentException($"Item with ID {createBillDto.ItemId} not found");

                var bill = new Bill
                {
                    CustomerId = createBillDto.CustomerId,
                    OwnerId = createBillDto.OwnerId,
                    ItemId = createBillDto.ItemId,
                    Amount = createBillDto.Amount
                };

                _context.Bills.Add(bill);
                await _context.SaveChangesAsync();

                var createdBill = await _context.Bills
                    .Include(b => b.Customer)
                        .ThenInclude(c => c!.Role)
                    .Include(b => b.Customer)
                        .ThenInclude(c => c!.City)
                    .Include(b => b.Customer)
                        .ThenInclude(c => c!.State)
                    .Include(b => b.Owner)
                        .ThenInclude(o => o!.Role)
                    .Include(b => b.Owner)
                        .ThenInclude(o => o!.City)
                    .Include(b => b.Owner)
                        .ThenInclude(o => o!.State)
                    .Include(b => b.OwnerItem)
                    .FirstAsync(b => b.BillNo == bill.BillNo);

                return MapToDTO(createdBill);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating bill");
                throw;
            }
        }

        private static BillResponseDTO MapToDTO(Bill bill)
        {
            return new BillResponseDTO
            {
                BillNo = bill.BillNo,
                BillDate = DateTime.Now,

                // Customer Info
                CustomerId = bill.CustomerId,
                CustomerName = bill.Customer != null
                    ? $"{bill.Customer.FirstName} {bill.Customer.LastName}".Trim()
                    : "Unknown",
                CustomerEmail = bill.Customer?.Email ?? "N/A",
                CustomerPhone = bill.Customer?.PhoneNo.ToString() ?? "N/A",
                CustomerAddress = bill.Customer?.Address ?? "N/A",
                CustomerCity = bill.Customer?.City?.CityName ?? "N/A",
                CustomerState = bill.Customer?.State?.StateName ?? "N/A",

                // Owner Info
                OwnerId = bill.OwnerId,
                OwnerName = bill.Owner != null
                    ? $"{bill.Owner.FirstName} {bill.Owner.LastName}".Trim()
                    : "Unknown",
                OwnerEmail = bill.Owner?.Email ?? "N/A",
                OwnerPhone = bill.Owner?.PhoneNo.ToString() ?? "N/A",
                OwnerAddress = bill.Owner?.Address ?? "N/A",
                OwnerCity = bill.Owner?.City?.CityName ?? "N/A",
                OwnerState = bill.Owner?.State?.StateName ?? "N/A",

                // Item Info
                ItemId = bill.ItemId,
                ItemBrand = bill.OwnerItem?.Brand ?? "N/A",
                ItemDescription = bill.OwnerItem?.Description ?? "N/A",
                ItemCondition = bill.OwnerItem?.ConditionType ?? "Good",
                RentPerDay = bill.OwnerItem?.RentPerDay ?? 0,
                DepositAmount = bill.OwnerItem?.DepositAmt ?? 0,

                // Bill Info
                Amount = bill.Amount
            };
        }
    }
}
