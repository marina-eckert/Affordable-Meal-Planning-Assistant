using MPA.API.DTOs;

namespace MPA.API.Interfaces;

public interface IMealService
{
    Task<MealPlanDto> GetMealPlanAsync(
        Guid userId,
        DateOnly weekStart);

    Task<MealPlanDto> GenerateRandomMealPlanAsync(
        Guid userId, 
        DateOnly weekStart);

    Task<MealPlanDayItemDto> AddMealPlanDayItemAsync(
        Guid userId,
        AddMealPlanDayItemDto addMealPlanDayItemDto);

    Task UpdateMealPlanDayItemAsync(
        Guid mealPlanDayItemId,
        Guid newRecipeId);

    Task DeleteMealPlanDayItemAsync(Guid mealPlanDayItemId);

    Task DeleteMealPlanAsync(Guid mealPlanId);
}