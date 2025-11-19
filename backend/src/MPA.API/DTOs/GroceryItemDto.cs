namespace MPA.API.DTOs;

public record GroceryItemDto(
    Guid Id,
    int Quantity,
    Guid UserId,
    IngredientDto Ingredient);