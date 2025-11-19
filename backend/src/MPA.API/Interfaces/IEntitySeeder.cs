using MPA.API.Persistence.Context;

namespace MPA.API.Interfaces;

public interface IEntitySeeder
{
    Task SeedAsync(AppDbContext context);
}