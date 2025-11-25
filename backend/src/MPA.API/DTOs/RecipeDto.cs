namespace MPA.API.DTOs;

public record RecipeDto(
    Guid Id,
    string Name,
    string Category,
    string ImageUrl,
    int DurationInMinutes,
    decimal Price,
    double Rating,
    List<IngredientDto> Ingredients);