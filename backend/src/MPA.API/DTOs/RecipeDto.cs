namespace MPA.API.DTOs;

public record RecipeDto(
    Guid Id,
    string Name,
    string ImageUrl,
    int DurationInMinutes,
    decimal Price,
    double Rating,
    List<IngredientDto> Ingredients);