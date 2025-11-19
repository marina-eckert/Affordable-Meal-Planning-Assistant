namespace MPA.API.DTOs;

public record MealPlanDayDto(
    Guid Id,
    DateOnly Date,
    Guid MealPlanId,
    List<MealPlanDayItemDto> Items);