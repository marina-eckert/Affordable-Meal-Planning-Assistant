using Microsoft.EntityFrameworkCore;
using MPA.API.DTOs;
using MPA.API.Entities;
using MPA.API.Interfaces;
using MPA.API.Persistence.Context;

namespace MPA.API.Services;

public class GroceryItemervice : IGroceryItemService
{
    private readonly AppDbContext _context;

    public GroceryItemervice(AppDbContext context)
    {
        _context = context;
    }
    
    public async Task<IEnumerable<GroceryItemDto>> GetGroceryItemsByUserIdAsync(
        Guid userId)
    {
        var groceryItems = await _context.GroceryItems
            .Include(x => x.Ingredient)
            .Where(x => x.UserId == userId)
            .ToListAsync();
        return MapToModels(groceryItems);
    }

    public async Task AddGroceryItemAsync(Guid userId, AddGroceryItemDto addGroceryItemDto)
    {
        var groceryItem = new GroceryItem
        {
            UserId = userId,
            IngredientId = addGroceryItemDto.IngredientId,
            Quantity = addGroceryItemDto.Quantity
        };
        
        await _context.GroceryItems.AddAsync(groceryItem);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateGroceryItemAsync(Guid id, UpdateGroceryItemDto updateGroceryItemDto)
    {
        var groceryItem = await _context.GroceryItems.FirstOrDefaultAsync(x => x.Id == id);
        if (groceryItem is null)
        {
            throw new ApplicationException("Grocery Item was not found.");
        }

        groceryItem.Quantity = updateGroceryItemDto.Quantity;

        _context.GroceryItems.Update(groceryItem);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteGroceryItemAsync(Guid id)
    {
        var groceryItem = await _context.GroceryItems.FirstOrDefaultAsync(x => x.Id == id);
        if (groceryItem is null)
        {
            throw new ApplicationException("Grocery Item was not found.");
        }

        _context.GroceryItems.Remove(groceryItem);
        await _context.SaveChangesAsync();
    }

    private static IEnumerable<GroceryItemDto> MapToModels(IEnumerable<GroceryItem> groceryItems)
    {
        return groceryItems.Select(x => new GroceryItemDto(
            x.Id,
            x.Quantity,
            x.UserId,
            new IngredientDto(x.IngredientId, x.Ingredient.Name)));
    }
}