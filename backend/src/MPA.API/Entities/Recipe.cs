namespace MPA.API.Entities;

public class Recipe
{
    public Guid Id { get; init; }
    public string Name { get; init; } = null!;
    public string ImageUrl { get; init; } = null!;
    public int DurationMinutes { get; init; }
    public decimal Price { get; set; }
    public double Rating { get; init; }

    public ICollection<Ingredient> Ingredients { get; init; } = [];
}