using Microsoft.AspNetCore.Mvc;
using BillingService.Models.DTOs;
using BillingService.Services;
using BillingService.Attributes;

namespace BillingService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BillingController : ControllerBase
    {
        private readonly IBillingService _billingService;
        private readonly ILogger<BillingController> _logger;

        public BillingController(IBillingService billingService, ILogger<BillingController> logger)
        {
            _billingService = billingService;
            _logger = logger;
        }

        /// <summary>
        /// Get all bills (Admin only)
        /// </summary>
        [HttpGet("all")]
        [Attributes.Authorize("ADMIN")]
        public async Task<ActionResult<IEnumerable<BillResponseDTO>>> GetAllBills()
        {
            try
            {
                var bills = await _billingService.GetAllBillsAsync();
                _logger.LogInformation("Retrieved {Count} bills", bills.Count());
                return Ok(bills);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all bills");
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        /// <summary>
        /// Get bills by customer ID
        /// Customer can only see their own bills, Admin can see any customer's bills
        /// </summary>
        [HttpGet("customer/{customerId}")]
        [Attributes.Authorize("CUSTOMER", "ADMIN")]
        public async Task<ActionResult<IEnumerable<BillResponseDTO>>> GetBillsByCustomerId(int customerId)
        {
            try
            {
                var userId = (int?)HttpContext.Items["UserId"];
                var userRole = HttpContext.Items["Role"]?.ToString();

                // Customer can only view their own bills
                if (userRole?.Equals("CUSTOMER", StringComparison.OrdinalIgnoreCase) == true)
                {
                    if (userId != customerId)
                    {
                        _logger.LogWarning("Customer {UserId} attempted to access bills of customer {CustomerId}", userId, customerId);
                        return Forbid();
                    }
                }

                var bills = await _billingService.GetBillsByCustomerIdAsync(customerId);
                _logger.LogInformation("Retrieved {Count} bills for customer {CustomerId}", bills.Count(), customerId);
                return Ok(bills);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving bills for customer {CustomerId}", customerId);
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        /// <summary>
        /// Get bills by owner ID
        /// Owner can only see their own bills, Admin can see any owner's bills
        /// </summary>
        [HttpGet("owner/{ownerId}")]
        [Attributes.Authorize("OWNER", "ADMIN")]
        public async Task<ActionResult<IEnumerable<BillResponseDTO>>> GetBillsByOwnerId(int ownerId)
        {
            try
            {
                var userId = (int?)HttpContext.Items["UserId"];
                var userRole = HttpContext.Items["Role"]?.ToString();

                // Owner can only view their own bills
                if (userRole?.Equals("OWNER", StringComparison.OrdinalIgnoreCase) == true)
                {
                    if (userId != ownerId)
                    {
                        _logger.LogWarning("Owner {UserId} attempted to access bills of owner {OwnerId}", userId, ownerId);
                        return Forbid();
                    }
                }

                var bills = await _billingService.GetBillsByOwnerIdAsync(ownerId);
                _logger.LogInformation("Retrieved {Count} bills for owner {OwnerId}", bills.Count(), ownerId);
                return Ok(bills);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving bills for owner {OwnerId}", ownerId);
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        /// <summary>
        /// Get specific bill by bill number
        /// Users can only see bills where they are customer/owner, Admin can see any bill
        /// </summary>
        [HttpGet("{billNo}")]
        [Attributes.Authorize]
        public async Task<ActionResult<BillResponseDTO>> GetBillById(int billNo)
        {
            try
            {
                var bill = await _billingService.GetBillByIdAsync(billNo);

                if (bill == null)
                {
                    _logger.LogWarning("Bill {BillNo} not found", billNo);
                    return NotFound(new { message = $"Bill {billNo} not found" });
                }

                var userId = (int?)HttpContext.Items["UserId"];
                var userRole = HttpContext.Items["Role"]?.ToString();

                // Check authorization
                if (userRole?.Equals("ADMIN", StringComparison.OrdinalIgnoreCase) != true)
                {
                    // Non-admin users can only see bills where they are customer or owner
                    if (bill.CustomerId != userId && bill.OwnerId != userId)
                    {
                        _logger.LogWarning("User {UserId} attempted to access unauthorized bill {BillNo}", userId, billNo);
                        return Forbid();
                    }
                }

                _logger.LogInformation("Retrieved bill {BillNo}", billNo);
                return Ok(bill);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving bill {BillNo}", billNo);
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        /// <summary>
        /// Create a new bill (Admin only - optional endpoint)
        /// Normally bills are created by Spring Boot OrderService, but this allows manual creation
        /// </summary>
        [HttpPost("create")]
        [Attributes.Authorize("ADMIN")]
        public async Task<ActionResult<BillResponseDTO>> CreateBill([FromBody] CreateBillDTO createBillDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var bill = await _billingService.CreateBillAsync(createBillDto);
                _logger.LogInformation("Bill {BillNo} created successfully", bill.BillNo);

                return CreatedAtAction(
                    nameof(GetBillById),
                    new { billNo = bill.BillNo },
                    bill
                );
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Invalid data for bill creation");
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating bill");
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        /// <summary>
        /// Health check endpoint (no authentication required)
        /// </summary>
        [HttpGet("health")]
        public ActionResult<object> HealthCheck()
        {
            return Ok(new
            {
                status = "healthy",
                service = "Billing Service",
                timestamp = DateTime.UtcNow
            });
        }
    }
}