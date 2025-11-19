namespace MPA.API.Entities;

public class MealPlanDay
{
    public Guid Id { get; init; }
    public DateOnly Date { get; init; }
    
    public MealPlan MealPlan { get; init; } = null!;
    public Guid MealPlanId { get; init; }

    public ICollection<MealPlanDayItem> Items { get; init; } = [];
}