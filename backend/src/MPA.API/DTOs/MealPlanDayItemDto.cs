using MPA.API.Enums;

namespace MPA.API.DTOs;

public record MealPlanDayItemDto(
    Guid Id,
    MealType MealType,
    Guid MealPlanDayId,
    RecipeDto Recipe);