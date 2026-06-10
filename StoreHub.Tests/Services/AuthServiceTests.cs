using AutoMapper;
using FluentAssertions;
using Microsoft.Extensions.Configuration;
using Moq;
using StoreHub.API;
using StoreHub.API.DTOs;
using StoreHub.API.Models;
using StoreHub.API.Repositories.Interfaces;
using StoreHub.API.Services;
using Xunit;

namespace StoreHub.Tests.Services;

public class AuthServiceTests
{
    private readonly Mock<IUserRepository> _userRepoMock;
    private readonly IConfiguration _config;
    private readonly IMapper _mapper;
    private readonly AuthService _service;

    public AuthServiceTests()
    {
        _userRepoMock = new Mock<IUserRepository>();

        var inMemorySettings = new Dictionary<string, string>
        {
            { "Jwt:Key", "TestSuperSecretKey_MustBe32CharsOrMore!" },
            { "Jwt:Issuer", "TestIssuer" },
            { "Jwt:Audience", "TestAudience" }
        };
        _config = new ConfigurationBuilder()
            .AddInMemoryCollection(inMemorySettings!)
            .Build();

        var mapperConfig = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>());
        _mapper = mapperConfig.CreateMapper();
        _service = new AuthService(_userRepoMock.Object, _config, _mapper);
    }

    [Fact]
    public async Task RegisterAsync_ThrowsInvalidOperation_WhenEmailExists()
    {
        // Arrange
        _userRepoMock.Setup(r => r.EmailExistsAsync("test@example.com")).ReturnsAsync(true);

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            _service.RegisterAsync(new RegisterRequestDto
            {
                FullName = "John", Email = "test@example.com", Password = "Pass1"
            }));
    }

    [Fact]
    public async Task RegisterAsync_ReturnsToken_OnSuccess()
    {
        // Arrange
        _userRepoMock.Setup(r => r.EmailExistsAsync(It.IsAny<string>())).ReturnsAsync(false);
        _userRepoMock.Setup(r => r.CreateAsync(It.IsAny<User>()))
            .ReturnsAsync((User u) => { u.Id = 1; return u; });

        // Act
        var result = await _service.RegisterAsync(new RegisterRequestDto
        {
            FullName = "John Doe", Email = "john@example.com", Password = "Password1"
        });

        // Assert
        result.Token.Should().NotBeNullOrEmpty();
        result.User.Email.Should().Be("john@example.com");
    }

    [Fact]
    public async Task LoginAsync_ThrowsUnauthorized_WhenEmailNotFound()
    {
        // Arrange
        _userRepoMock.Setup(r => r.GetByEmailAsync(It.IsAny<string>())).ReturnsAsync((User?)null);

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            _service.LoginAsync(new LoginRequestDto { Email = "x@x.com", Password = "Pass1" }));
    }

    [Fact]
    public async Task LoginAsync_ThrowsUnauthorized_WhenPasswordWrong()
    {
        // Arrange
        var user = new User
        {
            Id = 1, Email = "user@test.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("CorrectPassword1")
        };
        _userRepoMock.Setup(r => r.GetByEmailAsync("user@test.com")).ReturnsAsync(user);

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            _service.LoginAsync(new LoginRequestDto { Email = "user@test.com", Password = "WrongPassword1" }));
    }

    [Fact]
    public async Task LoginAsync_ReturnsToken_OnValidCredentials()
    {
        // Arrange
        var password = "ValidPass1";
        var user = new User
        {
            Id = 1, Email = "user@test.com", FullName = "Test User",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
            IsAdmin = false
        };
        _userRepoMock.Setup(r => r.GetByEmailAsync("user@test.com")).ReturnsAsync(user);

        // Act
        var result = await _service.LoginAsync(new LoginRequestDto
        {
            Email = "user@test.com", Password = password
        });

        // Assert
        result.Token.Should().NotBeNullOrEmpty();
        result.User.Id.Should().Be(1);
    }
}
