namespace MPA.API.DTOs;

public record MealPlanDto(
    Guid Id,
    DateOnly WeekStart,
    Guid UserId,
    List<MealPlanDayDto> Days);