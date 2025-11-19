using MPA.API.DTOs;

namespace MPA.API.Interfaces;

public interface IIngredientService
{
    Task<IEnumerable<IngredientDto>> GetIngredientsAsync();
}