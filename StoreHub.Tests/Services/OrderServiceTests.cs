using AutoMapper;
using FluentAssertions;
using Moq;
using StoreHub.API;
using StoreHub.API.DTOs;
using StoreHub.API.Models;
using StoreHub.API.Repositories.Interfaces;
using StoreHub.API.Services;
using Xunit;

namespace StoreHub.Tests.Services;

public class OrderServiceTests
{
    private readonly Mock<IOrderRepository> _orderRepoMock;
    private readonly Mock<IProductRepository> _productRepoMock;
    private readonly IMapper _mapper;
    private readonly OrderService _service;

    public OrderServiceTests()
    {
        _orderRepoMock = new Mock<IOrderRepository>();
        _productRepoMock = new Mock<IProductRepository>();
        var config = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>());
        _mapper = config.CreateMapper();
        _service = new OrderService(_orderRepoMock.Object, _productRepoMock.Object, _mapper);
    }

    [Fact]
    public async Task CreateAsync_ThrowsInvalidOperation_WhenNoItems()
    {
        // Arrange
        var dto = new CreateOrderDto { Items = new List<CreateOrderItemDto>() };

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() => _service.CreateAsync(1, dto));
    }

    [Fact]
    public async Task CreateAsync_ThrowsKeyNotFoundException_WhenProductNotFound()
    {
        // Arrange
        _productRepoMock.Setup(r => r.GetByIdAsync(99)).ReturnsAsync((Product?)null);
        var dto = new CreateOrderDto
        {
            Items = new List<CreateOrderItemDto> { new() { ProductId = 99, Quantity = 1 } }
        };

        // Act & Assert
        await Assert.ThrowsAsync<KeyNotFoundException>(() => _service.CreateAsync(1, dto));
    }

    [Fact]
    public async Task CreateAsync_ThrowsInvalidOperation_WhenInsufficientStock()
    {
        // Arrange
        var product = new Product { Id = 1, Name = "Mouse", Price = 20m, StockQuantity = 2 };
        _productRepoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(product);
        var dto = new CreateOrderDto
        {
            Items = new List<CreateOrderItemDto> { new() { ProductId = 1, Quantity = 5 } }
        };

        // Act & Assert
        var ex = await Assert.ThrowsAsync<InvalidOperationException>(() => _service.CreateAsync(1, dto));
        ex.Message.Should().Contain("Insufficient stock");
    }

    [Fact]
    public async Task CreateAsync_CreatesOrder_AndReducesStock()
    {
        // Arrange
        var product = new Product { Id = 1, Name = "Keyboard", Price = 30m, StockQuantity = 10 };
        _productRepoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(product);
        _productRepoMock.Setup(r => r.UpdateAsync(It.IsAny<Product>())).ReturnsAsync(product);

        var savedOrder = new Order
        {
            Id = 1, UserId = 1, Status = OrderStatus.Pending, TotalAmount = 60m,
            User = new User { Id = 1, FullName = "John", Email = "john@test.com" },
            OrderItems = new List<OrderItem>
            {
                new() { Id = 1, ProductId = 1, Quantity = 2, UnitPrice = 30m,
                        Product = new Product { Id = 1, Name = "Keyboard" } }
            }
        };
        _orderRepoMock.Setup(r => r.CreateAsync(It.IsAny<Order>())).ReturnsAsync(savedOrder);
        _orderRepoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(savedOrder);

        var dto = new CreateOrderDto
        {
            Items = new List<CreateOrderItemDto> { new() { ProductId = 1, Quantity = 2 } }
        };

        // Act
        var result = await _service.CreateAsync(1, dto);

        // Assert
        result.TotalAmount.Should().Be(60m);
        _productRepoMock.Verify(r => r.UpdateAsync(It.Is<Product>(p => p.StockQuantity == 8)), Times.Once);
    }

    [Fact]
    public async Task UpdateStatusAsync_ThrowsKeyNotFoundException_WhenOrderNotFound()
    {
        // Arrange
        _orderRepoMock.Setup(r => r.GetByIdAsync(99)).ReturnsAsync((Order?)null);

        // Act & Assert
        await Assert.ThrowsAsync<KeyNotFoundException>(() =>
            _service.UpdateStatusAsync(99, new UpdateOrderStatusDto { Status = "Delivered" }, 1, true));
    }

    [Fact]
    public async Task UpdateStatusAsync_ThrowsUnauthorized_WhenUserAccessesOtherOrder()
    {
        // Arrange
        var order = new Order
        {
            Id = 1, UserId = 2, Status = OrderStatus.Pending,
            User = new User { Id = 2, FullName = "Other" },
            OrderItems = new List<OrderItem>()
        };
        _orderRepoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(order);

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            _service.UpdateStatusAsync(1, new UpdateOrderStatusDto { Status = "Cancelled" }, 1, false));
    }
}
