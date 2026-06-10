using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StoreHub.API.DTOs;
using StoreHub.API.Services.Interfaces;

namespace StoreHub.API.Controllers;

[ApiController]
[Route("api/products")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService) => _productService = productService;

    /// <summary>Get all products with optional filtering and pagination.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(PagedResultDto<ProductDto>), 200)]
    public async Task<IActionResult> GetAll([FromQuery] ProductQueryDto query)
    {
        var result = await _productService.GetAllAsync(query);
        return Ok(result);
    }

    /// <summary>Get a single product by ID.</summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ProductDto), 200)]
    [ProducesResponseType(typeof(ApiErrorDto), 404)]
    public async Task<IActionResult> GetById(int id)
    {
        var product = await _productService.GetByIdAsync(id);
        return Ok(product);
    }

    /// <summary>Create a new product. Admin only.</summary>
    [HttpPost]
    [Authorize]
    [ProducesResponseType(typeof(ProductDto), 201)]
    [ProducesResponseType(typeof(ApiErrorDto), 400)]
    [ProducesResponseType(401)]
    public async Task<IActionResult> Create([FromBody] CreateProductDto dto)
    {
        RequireAdmin();
        var created = await _productService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>Update an existing product. Admin only.</summary>
    [HttpPut("{id:int}")]
    [Authorize]
    [ProducesResponseType(typeof(ProductDto), 200)]
    [ProducesResponseType(typeof(ApiErrorDto), 404)]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateProductDto dto)
    {
        RequireAdmin();
        var updated = await _productService.UpdateAsync(id, dto);
        return Ok(updated);
    }

    /// <summary>Delete a product. Admin only.</summary>
    [HttpDelete("{id:int}")]
    [Authorize]
    [ProducesResponseType(204)]
    [ProducesResponseType(typeof(ApiErrorDto), 404)]
    public async Task<IActionResult> Delete(int id)
    {
        RequireAdmin();
        await _productService.DeleteAsync(id);
        return NoContent();
    }

    private void RequireAdmin()
    {
        var isAdmin = User.FindFirst("isAdmin")?.Value;
        if (isAdmin != "True")
            throw new UnauthorizedAccessException("Admin access required.");
    }
}
