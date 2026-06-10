# StoreHub API — Inventory & Order Management System

ASP.NET Core 8 Web API backend for the StoreHub capstone project. Implements a full layered architecture with JWT authentication, EF Core, FluentValidation, AutoMapper, and xUnit tests.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | .NET 8, C# 12 |
| Framework | ASP.NET Core Web API |
| ORM | Entity Framework Core 8 |
| Database | SQL Server |
| Auth | JWT Bearer Tokens |
| Mapping | AutoMapper 12 |
| Validation | FluentValidation 11 |
| Password Hashing | BCrypt.Net-Next |
| API Docs | Swagger / OpenAPI |
| Testing | xUnit + Moq + FluentAssertions |

---

## Project Structure

```
StoreHub/
├── StoreHub.sln
├── StoreHub.API/
│   ├── Controllers/
│   │   ├── AuthController.cs
│   │   ├── ProductsController.cs
│   │   └── OrdersController.cs
│   ├── Models/
│   │   ├── User.cs
│   │   ├── Product.cs
│   │   ├── Order.cs
│   │   └── OrderItem.cs
│   ├── DTOs/
│   │   └── Dtos.cs
│   ├── Data/
│   │   └── AppDbContext.cs
│   ├── Repositories/
│   │   ├── Interfaces/IRepositories.cs
│   │   ├── UserRepository.cs
│   │   ├── ProductRepository.cs
│   │   └── OrderRepository.cs
│   ├── Services/
│   │   ├── Interfaces/IServices.cs
│   │   ├── AuthService.cs
│   │   ├── ProductService.cs
│   │   └── OrderService.cs
│   ├── Validators/
│   │   └── Validators.cs
│   ├── Middleware/
│   │   └── ExceptionMiddleware.cs
│   ├── MappingProfile.cs
│   ├── Program.cs
│   ├── appsettings.json
│   └── appsettings.Development.json
└── StoreHub.Tests/
    └── Services/
        ├── AuthServiceTests.cs
        ├── ProductServiceTests.cs
        └── OrderServiceTests.cs
```

---

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (Express or Developer edition)
- [EF Core CLI Tools](https://learn.microsoft.com/en-us/ef/core/cli/dotnet)

```bash
dotnet tool install --global dotnet-ef
```

---

## Setup & Run

### 1. Configure the database connection

Edit `StoreHub.API/appsettings.json`:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=StoreHubDb;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

> For SQL Server with username/password:
> `"Server=localhost;Database=StoreHubDb;User Id=sa;Password=YourPassword;TrustServerCertificate=True;"`

### 2. Apply migrations & seed data

```bash
cd StoreHub.API
dotnet ef migrations add InitialCreate
dotnet ef database update
```

Seed data is applied automatically via `OnModelCreating`. The seeded admin account:
- **Email:** `admin@storehub.com`
- **Password:** `Admin@123`

### 3. Run the API

```bash
dotnet run
```

The API will be available at:
- **Swagger UI:** `https://localhost:7xxx/` (root URL)
- **HTTP:** `http://localhost:5xxx/`

---

## API Reference

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login, get JWT |
| POST | `/api/auth/logout` | Public | Logout (client-side) |

### Products

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/products` | Public | List products (filterable) |
| GET | `/api/products/{id}` | Public | Get single product |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/{id}` | Admin | Update product |
| DELETE | `/api/products/{id}` | Admin | Delete product |

**Query parameters for GET `/api/products`:**
- `name` — filter by name (partial match)
- `category` — exact category match
- `minPrice` / `maxPrice` — price range filter
- `page` (default: 1) / `pageSize` (default: 20) — pagination

### Orders

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/orders` | User | Place an order |
| GET | `/api/orders/mine` | User | My order history |
| GET | `/api/orders` | Admin | All orders |
| PUT | `/api/orders/{id}/status` | User/Admin | Update status |

**Valid order statuses:** `Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`

---

## Error Response Format

All errors return the following consistent structure:

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/products/999",
  "error": "Not Found",
  "message": "Product 999 not found."
}
```

---

## Running Tests

```bash
cd StoreHub.Tests
dotnet test
```

To see coverage:

```bash
dotnet test --collect:"XPlat Code Coverage"
```

---

## Using Swagger

1. Run the API (`dotnet run`)
2. Open `https://localhost:{port}/` in your browser
3. Click **Authorize** (top right) and enter: `Bearer <your_jwt_token>`
4. You can now call protected endpoints directly from Swagger

**To get a token:**
- Call `POST /api/auth/login` with `{ "email": "admin@storehub.com", "password": "Admin@123" }`
- Copy the `token` from the response

---

## Environment Variables (Production)

For production, override via environment variables:

```
ConnectionStrings__DefaultConnection=Server=...
Jwt__Key=<strong-random-secret-minimum-32-chars>
Jwt__Issuer=StoreHub.API
Jwt__Audience=StoreHub.Client
```

---

## CORS

The API is configured to allow requests from React Vite dev server at `http://localhost:5173`.  
To change this, update the `WithOrigins(...)` call in `Program.cs`.

---

## Seed Data Summary

| Entity | Data |
|---|---|
| Admin User | admin@storehub.com / Admin@123 |
| Products | Wireless Keyboard, USB-C Hub, Ergonomic Mouse, Desk Lamp |

> Products with `StockQuantity ≤ 5` can be treated as low-inventory alerts on the frontend dashboard.

---

## Git Branching Strategy

```
main          — stable, production-ready
develop       — integration branch
feature/xxx   — individual features
bugfix/xxx    — bug fixes
```
