using MPA.API.DTOs;

namespace MPA.API.Interfaces;

public interface IFavoriteService
{
    Task<List<Guid>> GetUserFavoriteRecipeIdsAsync(Guid userId);
    Task AddFavoriteAsync(Guid userId, Guid recipeId);
    Task RemoveFavoriteAsync(Guid userId, Guid recipeId);
}
