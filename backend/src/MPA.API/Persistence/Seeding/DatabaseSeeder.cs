using MPA.API.Interfaces;
using MPA.API.Persistence.Context;

namespace MPA.API.Persistence.Seeding;

public class DatabaseSeeder : IDatabaseSeeder
{
    private readonly AppDbContext _context;
    private readonly IEnumerable<IEntitySeeder> _entitySeeders;

    public DatabaseSeeder(
        AppDbContext context, 
        IEnumerable<IEntitySeeder> entitySeeders)
    {
        _context = context;
        _entitySeeders = entitySeeders;
    }

    public async Task SeedAsync()
    {
        foreach (var entitySeeder in _entitySeeders)
        {
            await entitySeeder.SeedAsync(_context);
        }

        await _context.SaveChangesAsync();
    }
}