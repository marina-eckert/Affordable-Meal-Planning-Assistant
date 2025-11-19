using MPA.API.Enums;

namespace MPA.API.DTOs;

public record AddMealPlanDayItemDto(
    DateOnly Date,
    MealType MealType,
    Guid RecipeId);