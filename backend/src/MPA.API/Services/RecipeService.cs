using Microsoft.EntityFrameworkCore;
using MPA.API.DTOs;
using MPA.API.Entities;
using MPA.API.Interfaces;
using MPA.API.Persistence.Context;

namespace MPA.API.Services;

public class RecipeService : IRecipeService
{
    private readonly AppDbContext _context;

    public RecipeService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<RecipeDto>> GetRecipesAsync()
    {
        var recipes = await _context.Recipes
            .Include(x => x.Ingredients)
            .ToListAsync();
        return MapToModels(recipes);
    }

    private static IEnumerable<RecipeDto> MapToModels(IEnumerable<Recipe> recipes)
    {
        return recipes.Select(x => new RecipeDto(
            x.Id,
            x.Name,
            x.Category,
            x.ImageUrl,
            x.DurationMinutes,
            x.Price,
            x.Rating,
            x.Ingredients.Select(i => new IngredientDto(i.Id, i.Name)).ToList()));
    }
}