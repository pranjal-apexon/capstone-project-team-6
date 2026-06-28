using AutoMapper;
using StoreHub.API.DTOs;
using StoreHub.API.Models;
using StoreHub.API.Repositories.Interfaces;
using StoreHub.API.Services.Interfaces;

namespace StoreHub.API.Services;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepo;
    private readonly IProductRepository _productRepo;
    private readonly IMapper _mapper;

    public OrderService(IOrderRepository orderRepo, IProductRepository productRepo, IMapper mapper)
    {
        _orderRepo = orderRepo;
        _productRepo = productRepo;
        _mapper = mapper;
    }

    public async Task<OrderDto> CreateAsync(int userId, CreateOrderDto dto)
    {
        if (!dto.Items.Any())
            throw new InvalidOperationException("Order must contain at least one item.");

        var order = new Order { UserId = userId };
        var productsToUpdate = new List<Product>();

        // First, validate all items and collect products to update
        foreach (var item in dto.Items)
        {
            var product = await _productRepo.GetByIdAsync(item.ProductId)
                ?? throw new KeyNotFoundException($"Product {item.ProductId} not found.");

            if (item.Quantity <= 0)
                throw new InvalidOperationException($"Quantity for product {product.Name} must be at least 1.");

            if (product.StockQuantity < item.Quantity)
                throw new InvalidOperationException(
                    $"Insufficient stock for '{product.Name}'. Available: {product.StockQuantity}, Requested: {item.Quantity}");

            product.StockQuantity -= item.Quantity;
            productsToUpdate.Add(product);

            order.OrderItems.Add(new OrderItem
            {
                ProductId = item.ProductId,
                Quantity = item.Quantity,
                UnitPrice = product.Price
            });
        }

        // Update all products
        foreach (var product in productsToUpdate)
        {
            await _productRepo.UpdateAsync(product);
        }

        order.TotalAmount = order.OrderItems.Sum(i => i.Quantity * i.UnitPrice);
        var created = await _orderRepo.CreateAsync(order);

        // Reload with relations
        return _mapper.Map<OrderDto>(await _orderRepo.GetByIdAsync(created.Id));
    }

    public async Task<List<OrderDto>> GetMyOrdersAsync(int userId)
    {
        var orders = await _orderRepo.GetByUserIdAsync(userId);
        return _mapper.Map<List<OrderDto>>(orders);
    }

    public async Task<List<OrderDto>> GetAllOrdersAsync()
    {
        var orders = await _orderRepo.GetAllAsync();
        return _mapper.Map<List<OrderDto>>(orders);
    }

    public async Task<OrderDto> UpdateStatusAsync(int orderId, UpdateOrderStatusDto dto,
        int requestingUserId, bool isAdmin)
    {
        var order = await _orderRepo.GetByIdAsync(orderId)
            ?? throw new KeyNotFoundException($"Order {orderId} not found.");

        if (!isAdmin && order.UserId != requestingUserId)
            throw new UnauthorizedAccessException("You do not have access to this order.");

        if (!Enum.TryParse<OrderStatus>(dto.Status, true, out var newStatus))
            throw new InvalidOperationException($"Invalid status '{dto.Status}'. Valid values: Pending, Processing, Shipped, Delivered, Cancelled.");

        // Restore stock on cancellation
        if (newStatus == OrderStatus.Cancelled && order.Status != OrderStatus.Cancelled)
        {
            foreach (var item in order.OrderItems)
            {
                var product = await _productRepo.GetByIdAsync(item.ProductId);
                if (product != null)
                {
                    product.StockQuantity += item.Quantity;
                    await _productRepo.UpdateAsync(product);
                }
            }
        }

        order.Status = newStatus;
        await _orderRepo.UpdateAsync(order);

        return _mapper.Map<OrderDto>(await _orderRepo.GetByIdAsync(orderId));
    }
}
