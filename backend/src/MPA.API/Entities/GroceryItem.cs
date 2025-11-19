namespace MPA.API.Entities;

public class GroceryItem
{
    public Guid Id { get; set; }
    public int Quantity { get; set; }

    public User User { get; set; } = null!;
    public Guid UserId { get; set; }

    public Ingredient Ingredient { get; set; } = null!;
    public Guid IngredientId { get; set; }
}