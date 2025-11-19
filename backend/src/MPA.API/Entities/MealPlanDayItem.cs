using MPA.API.Enums;

namespace MPA.API.Entities;

public class MealPlanDayItem
{
    public Guid Id { get; init; }
    public MealType MealType { get; init; }
    

    public MealPlanDay MealPlanDay { get; init; } = null!;
    public Guid MealPlanDayId { get; init; }

    public Recipe Recipe { get; init; } = null!;
    public Guid RecipeId { get; set; }
}