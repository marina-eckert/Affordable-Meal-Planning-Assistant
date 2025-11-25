namespace MPA.API.DTOs;

public record AddGroceryItemDto(
    Guid? IngredientId,
    string? IngredientName,
    int Quantity);