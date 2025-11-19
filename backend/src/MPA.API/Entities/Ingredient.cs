namespace MPA.API.Entities;

public class Ingredient
{
    public Guid Id { get; init; }
    public string Name { get; init; } = null!;

    public ICollection<Recipe> Recipes { get; init; } = [];
}