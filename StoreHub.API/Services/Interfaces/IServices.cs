using StoreHub.API.DTOs;

namespace StoreHub.API.Services.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterRequestDto dto);
    Task<AuthResponseDto> LoginAsync(LoginRequestDto dto);
}

public interface IProductService
{
    Task<PagedResultDto<ProductDto>> GetAllAsync(ProductQueryDto query);
    Task<ProductDto> GetByIdAsync(int id);
    Task<ProductDto> CreateAsync(CreateProductDto dto);
    Task<ProductDto> UpdateAsync(int id, UpdateProductDto dto);
    Task DeleteAsync(int id);
}

public interface IOrderService
{
    Task<OrderDto> CreateAsync(int userId, CreateOrderDto dto);
    Task<OrderDto> GetByIdAsync(int orderId, int requestingUserId, bool isAdmin);
    Task<List<OrderDto>> GetMyOrdersAsync(int userId);
    Task<List<OrderDto>> GetAllOrdersAsync();
    Task<OrderDto> UpdateStatusAsync(int orderId, UpdateOrderStatusDto dto, int requestingUserId, bool isAdmin);
}
