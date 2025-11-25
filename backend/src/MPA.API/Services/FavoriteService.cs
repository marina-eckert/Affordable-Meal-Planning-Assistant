using Microsoft.EntityFrameworkCore;
using MPA.API.Entities;
using MPA.API.Interfaces;
using MPA.API.Persistence.Context;

namespace MPA.API.Services;

public class FavoriteService : IFavoriteService
{
    private readonly AppDbContext _context;

    public FavoriteService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Guid>> GetUserFavoriteRecipeIdsAsync(Guid userId)
    {
        return await _context.Favorites
            .Where(f => f.UserId == userId)
            .Select(f => f.RecipeId)
            .ToListAsync();
    }

    public async Task AddFavoriteAsync(Guid userId, Guid recipeId)
    {
        var exists = await _context.Favorites
            .AnyAsync(f => f.UserId == userId && f.RecipeId == recipeId);

        if (exists) return;

        var favorite = new Favorite { UserId = userId, RecipeId = recipeId };
        _context.Favorites.Add(favorite);
        await _context.SaveChangesAsync();
    }

    public async Task RemoveFavoriteAsync(Guid userId, Guid recipeId)
    {
        var favorite = await _context.Favorites
            .FirstOrDefaultAsync(f => f.UserId == userId && f.RecipeId == recipeId);

        if (favorite == null) return;

        _context.Favorites.Remove(favorite);
        await _context.SaveChangesAsync();
    }
}
