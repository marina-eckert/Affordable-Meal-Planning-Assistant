namespace MPA.API.Entities;

public class MealPlan
{
    public Guid Id { get; init; }
    public DateOnly WeekStart { get; init; }
    
    public User User { get; init; } = null!;
    public Guid UserId { get; init; }

    public ICollection<MealPlanDay> Days { get; init; } = [];
}