namespace MPA.API.DTOs;

public record AddGroceryItemDto(
    Guid IngredientId,
    int Quantity);