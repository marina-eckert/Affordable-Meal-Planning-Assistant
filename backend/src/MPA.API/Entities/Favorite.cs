namespace MPA.API.Entities;

public class Favorite
{
    public Guid UserId { get; set; }
    public Guid RecipeId { get; set; }
}
