using MPA.API.DTOs;

namespace MPA.API.Interfaces;

public interface IGroceryItemService
{
    Task<IEnumerable<GroceryItemDto>> GetGroceryItemsByUserIdAsync(
        Guid userId);

    Task AddGroceryItemAsync(
        Guid userId,
        AddGroceryItemDto addGroceryItemDto);

    Task UpdateGroceryItemAsync(
        Guid id,
        UpdateGroceryItemDto updateGroceryItemDto);

    Task DeleteGroceryItemAsync(
        Guid id);
}