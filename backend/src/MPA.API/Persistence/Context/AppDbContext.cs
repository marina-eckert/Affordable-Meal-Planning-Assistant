using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MPA.API.Entities;

namespace MPA.API.Persistence.Context;

public class AppDbContext : IdentityDbContext<User, Role, Guid>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options){}

    public DbSet<Ingredient> Ingredients { get; init; }
    public DbSet<Recipe> Recipes { get; init; }
    public DbSet<GroceryItem> GroceryItems { get; init; }
    public DbSet<MealPlan> MealPlans { get; init; }
    public DbSet<MealPlanDay> MealPlanDays { get; init; }
    public DbSet<MealPlanDayItem> MealPlanDayItems { get; init; }
}