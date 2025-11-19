using MPA.API.DTOs;

namespace MPA.API.Interfaces;

public interface IRecipeService
{
    Task<IEnumerable<RecipeDto>> GetRecipesAsync();
}