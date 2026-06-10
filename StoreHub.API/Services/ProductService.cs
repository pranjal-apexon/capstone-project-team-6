using AutoMapper;
using StoreHub.API.DTOs;
using StoreHub.API.Models;
using StoreHub.API.Repositories.Interfaces;
using StoreHub.API.Services.Interfaces;

namespace StoreHub.API.Services;

public class ProductService : IProductService
{
    private readonly IProductRepository _productRepo;
    private readonly IMapper _mapper;

    public ProductService(IProductRepository productRepo, IMapper mapper)
    {
        _productRepo = productRepo;
        _mapper = mapper;
    }

    public async Task<PagedResultDto<ProductDto>> GetAllAsync(ProductQueryDto query)
    {
        var (items, total) = await _productRepo.GetAllAsync(query);
        return new PagedResultDto<ProductDto>
        {
            Items = _mapper.Map<List<ProductDto>>(items),
            TotalCount = total,
            Page = query.Page,
            PageSize = query.PageSize
        };
    }

    public async Task<ProductDto> GetByIdAsync(int id)
    {
        var product = await _productRepo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Product {id} not found.");
        return _mapper.Map<ProductDto>(product);
    }

    public async Task<ProductDto> CreateAsync(CreateProductDto dto)
    {
        var product = _mapper.Map<Product>(dto);
        var created = await _productRepo.CreateAsync(product);
        return _mapper.Map<ProductDto>(created);
    }

    public async Task<ProductDto> UpdateAsync(int id, UpdateProductDto dto)
    {
        var product = await _productRepo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Product {id} not found.");

        _mapper.Map(dto, product);
        var updated = await _productRepo.UpdateAsync(product);
        return _mapper.Map<ProductDto>(updated);
    }

    public async Task DeleteAsync(int id)
    {
        var product = await _productRepo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Product {id} not found.");
        await _productRepo.DeleteAsync(product);
    }
}
