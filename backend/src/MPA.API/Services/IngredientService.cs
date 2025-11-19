using Microsoft.EntityFrameworkCore;
using MPA.API.DTOs;
using MPA.API.Entities;
using MPA.API.Interfaces;
using MPA.API.Persistence.Context;

namespace MPA.API.Services;

public class IngredientService : IIngredientService
{
    private readonly AppDbContext _context;

    public IngredientService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<IngredientDto>> GetIngredientsAsync()
    {
        var ingredients = await _context.Ingredients.ToListAsync();
        return MapToModels(ingredients);
    }

    private static IEnumerable<IngredientDto> MapToModels(IEnumerable<Ingredient> ingredients)
    {
        return ingredients.Select(x => new IngredientDto(x.Id, x.Name));
    }
}