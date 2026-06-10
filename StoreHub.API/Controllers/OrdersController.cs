using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StoreHub.API.DTOs;
using StoreHub.API.Services.Interfaces;

namespace StoreHub.API.Controllers;

[ApiController]
[Route("api/orders")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService) => _orderService = orderService;

    /// <summary>Place a new order.</summary>
    [HttpPost]
    [ProducesResponseType(typeof(OrderDto), 201)]
    [ProducesResponseType(typeof(ApiErrorDto), 400)]
    public async Task<IActionResult> Create([FromBody] CreateOrderDto dto)
    {
        var userId = GetUserId();
        var order = await _orderService.CreateAsync(userId, dto);
        return CreatedAtAction(nameof(GetMine), order);
    }

    /// <summary>Get the current user's order history.</summary>
    [HttpGet("mine")]
    [ProducesResponseType(typeof(List<OrderDto>), 200)]
    public async Task<IActionResult> GetMine()
    {
        var orders = await _orderService.GetMyOrdersAsync(GetUserId());
        return Ok(orders);
    }

    /// <summary>Get all orders. Admin only.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(List<OrderDto>), 200)]
    public async Task<IActionResult> GetAll()
    {
        RequireAdmin();
        var orders = await _orderService.GetAllOrdersAsync();
        return Ok(orders);
    }

    /// <summary>Update order status. Admin can set any status; user can only cancel their own order.</summary>
    [HttpPut("{id:int}/status")]
    [ProducesResponseType(typeof(OrderDto), 200)]
    [ProducesResponseType(typeof(ApiErrorDto), 400)]
    [ProducesResponseType(typeof(ApiErrorDto), 404)]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateOrderStatusDto dto)
    {
        var isAdmin = User.FindFirst("isAdmin")?.Value == "True";
        var updated = await _orderService.UpdateStatusAsync(id, dto, GetUserId(), isAdmin);
        return Ok(updated);
    }

    private int GetUserId()
    {
        var sub = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
               ?? User.FindFirst("sub")?.Value;
        return int.TryParse(sub, out var id) ? id : 0;
    }

    private void RequireAdmin()
    {
        if (User.FindFirst("isAdmin")?.Value != "True")
            throw new UnauthorizedAccessException("Admin access required.");
    }
}
