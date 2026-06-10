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

public class ProductServiceTests
{
    private readonly Mock<IProductRepository> _repoMock;
    private readonly IMapper _mapper;
    private readonly ProductService _service;

    public ProductServiceTests()
    {
        _repoMock = new Mock<IProductRepository>();
        var config = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>());
        _mapper = config.CreateMapper();
        _service = new ProductService(_repoMock.Object, _mapper);
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsProduct_WhenExists()
    {
        // Arrange
        var product = new Product
        {
            Id = 1, Name = "Keyboard", Price = 29.99m,
            StockQuantity = 10, Category = "Electronics", Description = "Test"
        };
        _repoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(product);

        // Act
        var result = await _service.GetByIdAsync(1);

        // Assert
        result.Should().NotBeNull();
        result.Id.Should().Be(1);
        result.Name.Should().Be("Keyboard");
    }

    [Fact]
    public async Task GetByIdAsync_ThrowsKeyNotFoundException_WhenNotExists()
    {
        // Arrange
        _repoMock.Setup(r => r.GetByIdAsync(99)).ReturnsAsync((Product?)null);

        // Act & Assert
        await Assert.ThrowsAsync<KeyNotFoundException>(() => _service.GetByIdAsync(99));
    }

    [Fact]
    public async Task CreateAsync_CreatesAndReturnsProduct()
    {
        // Arrange
        var dto = new CreateProductDto
        {
            Name = "Mouse", Description = "Wireless mouse",
            Price = 19.99m, StockQuantity = 50, Category = "Electronics"
        };
        var createdProduct = new Product
        {
            Id = 5, Name = dto.Name, Description = dto.Description,
            Price = dto.Price, StockQuantity = dto.StockQuantity, Category = dto.Category
        };
        _repoMock.Setup(r => r.CreateAsync(It.IsAny<Product>())).ReturnsAsync(createdProduct);

        // Act
        var result = await _service.CreateAsync(dto);

        // Assert
        result.Id.Should().Be(5);
        result.Name.Should().Be("Mouse");
        _repoMock.Verify(r => r.CreateAsync(It.IsAny<Product>()), Times.Once);
    }

    [Fact]
    public async Task UpdateAsync_ThrowsKeyNotFoundException_WhenProductNotFound()
    {
        // Arrange
        _repoMock.Setup(r => r.GetByIdAsync(99)).ReturnsAsync((Product?)null);
        var dto = new UpdateProductDto { Name = "X", Price = 1, StockQuantity = 0, Category = "Y" };

        // Act & Assert
        await Assert.ThrowsAsync<KeyNotFoundException>(() => _service.UpdateAsync(99, dto));
    }

    [Fact]
    public async Task DeleteAsync_CallsRepository_WhenProductExists()
    {
        // Arrange
        var product = new Product { Id = 1, Name = "Test", Price = 10, StockQuantity = 5, Category = "X" };
        _repoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(product);
        _repoMock.Setup(r => r.DeleteAsync(product)).Returns(Task.CompletedTask);

        // Act
        await _service.DeleteAsync(1);

        // Assert
        _repoMock.Verify(r => r.DeleteAsync(product), Times.Once);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsPaged_Result()
    {
        // Arrange
        var products = new List<Product>
        {
            new() { Id = 1, Name = "A", Price = 10, StockQuantity = 10, Category = "X" },
            new() { Id = 2, Name = "B", Price = 20, StockQuantity = 20, Category = "Y" }
        };
        var query = new ProductQueryDto { Page = 1, PageSize = 10 };
        _repoMock.Setup(r => r.GetAllAsync(query)).ReturnsAsync((products, 2));

        // Act
        var result = await _service.GetAllAsync(query);

        // Assert
        result.TotalCount.Should().Be(2);
        result.Items.Should().HaveCount(2);
    }
}
