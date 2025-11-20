using Microsoft.EntityFrameworkCore;
using MPA.API.Entities;
using MPA.API.Interfaces;
using MPA.API.Persistence.Context;

namespace MPA.API.Persistence.Seeding;

public class RecipeSeeder : IEntitySeeder
{
    public async Task SeedAsync(AppDbContext context)
    {
        if (context.Recipes.Any())
        {
            return;
        }

        var ingredients = await context.Ingredients.ToListAsync();

        var recipes = new List<Recipe>
        {
            new()
            {
                Id = Guid.NewGuid(),
                Name = "Chicken Rice Bowl",
                ImageUrl = "/images/recipes/chicken-rice-bowl.jpg",
                DurationMinutes = 25,
                Price = 6.99m,
                Rating = 4.7,
                Ingredients =
                {
                    GetIngredient("Chicken Breast"),
                    GetIngredient("Rice"),
                    GetIngredient("Garlic"),
                    GetIngredient("Salt"),
                    GetIngredient("Black Pepper"),
                    GetIngredient("Olive Oil")
                }
            },

            new()
            {
                Id = Guid.NewGuid(),
                Name = "Vegetable Stir Fry",
                ImageUrl = "/images/recipes/vegetable-stir-fry.jpg",
                DurationMinutes = 15,
                Price = 4.20m,
                Rating = 4.5,
                Ingredients =
                {
                    GetIngredient("Carrot"),
                    GetIngredient("Broccoli"),
                    GetIngredient("Bell Pepper"),
                    GetIngredient("Onion"),
                    GetIngredient("Soy Sauce"),
                    GetIngredient("Garlic"),
                    GetIngredient("Vegetable Oil")
                }
            },

            new()
            {
                Id = Guid.NewGuid(),
                Name = "Beef Pasta Bolognese",
                ImageUrl = "/images/recipes/bolognese.jpg",
                DurationMinutes = 30,
                Price = 7.40m,
                Rating = 4.8,
                Ingredients =
                {
                    GetIngredient("Ground Beef"),
                    GetIngredient("Onion"),
                    GetIngredient("Garlic"),
                    GetIngredient("Tomato Sauce"),
                    GetIngredient("Salt"),
                    GetIngredient("Black Pepper"),
                    GetIngredient("Spaghetti")
                }
            },

            new()
            {
                Id = Guid.NewGuid(),
                Name = "Greek Salad",
                ImageUrl = "/images/recipes/greek-salad.jpg",
                DurationMinutes = 10,
                Price = 3.90m,
                Rating = 4.6,
                Ingredients =
                {
                    GetIngredient("Tomato"),
                    GetIngredient("Cucumber"),
                    GetIngredient("Onion"),
                    GetIngredient("Feta Cheese"),
                    GetIngredient("Olive Oil"),
                    GetIngredient("Salt"),
                    GetIngredient("Black Pepper")
                }
            },

            new()
            {
                Id = Guid.NewGuid(),
                Name = "Salmon with Vegetables",
                ImageUrl = "/images/recipes/salmon-veggies.jpg",
                DurationMinutes = 20,
                Price = 9.99m,
                Rating = 4.9,
                Ingredients =
                {
                    GetIngredient("Salmon"),
                    GetIngredient("Broccoli"),
                    GetIngredient("Carrot"),
                    GetIngredient("Olive Oil"),
                    GetIngredient("Salt"),
                    GetIngredient("Black Pepper"),
                    GetIngredient("Lemon")
                }
            },

            new()
            {
                Id = Guid.NewGuid(),
                Name = "Chicken Caesar Salad",
                ImageUrl = "/images/recipes/caesar-salad.jpg",
                DurationMinutes = 12,
                Price = 5.99m,
                Rating = 4.7,
                Ingredients =
                {
                    GetIngredient("Chicken Breast"),
                    GetIngredient("Lettuce"),
                    GetIngredient("Parmesan"),
                    GetIngredient("Garlic"),
                    GetIngredient("Olive Oil"),
                    GetIngredient("Salt"),
                    GetIngredient("Black Pepper")
                }
            },

            new()
            {
                Id = Guid.NewGuid(),
                Name = "Shrimp Noodle Bowl",
                ImageUrl = "/images/recipes/shrimp-noodles.jpg",
                DurationMinutes = 18,
                Price = 8.50m,
                Rating = 4.8,
                Ingredients =
                {
                    GetIngredient("Shrimp"),
                    GetIngredient("Noodles"),
                    GetIngredient("Garlic"),
                    GetIngredient("Soy Sauce"),
                    GetIngredient("Chili Pepper"),
                    GetIngredient("Sesame Oil")
                }
            },

            new()
            {
                Id = Guid.NewGuid(),
                Name = "Avocado Toast",
                ImageUrl = "/images/recipes/avocado-toast.jpg",
                DurationMinutes = 5,
                Price = 2.90m,
                Rating = 4.4,
                Ingredients =
                {
                    GetIngredient("Avocado"),
                    GetIngredient("Salt"),
                    GetIngredient("Black Pepper"),
                    GetIngredient("Lemon")
                }
            },

            new()
            {
                Id = Guid.NewGuid(),
                Name = "Lentil Soup",
                ImageUrl = "/images/recipes/lentil-soup.jpg",
                DurationMinutes = 35,
                Price = 3.40m,
                Rating = 4.7,
                Ingredients =
                {
                    GetIngredient("Lentils"),
                    GetIngredient("Carrot"),
                    GetIngredient("Onion"),
                    GetIngredient("Garlic"),
                    GetIngredient("Vegetable Broth"),
                    GetIngredient("Salt"),
                    GetIngredient("Black Pepper")
                }
            },

            new()
            {
                Id = Guid.NewGuid(),
                Name = "Omelette",
                ImageUrl = "/images/recipes/omelette.jpg",
                DurationMinutes = 8,
                Price = 1.80m,
                Rating = 4.3,
                Ingredients =
                {
                    GetIngredient("Eggs"),
                    GetIngredient("Onion"),
                    GetIngredient("Salt"),
                    GetIngredient("Black Pepper"),
                    GetIngredient("Butter")
                }
            },

            new()
            {
                Id = Guid.NewGuid(),
                Name = "Tofu Vegetable Bowl",
                ImageUrl = "/images/recipes/tofu-bowl.jpg",
                DurationMinutes = 18,
                Price = 5.20m,
                Rating = 4.5,
                Ingredients =
                {
                    GetIngredient("Tofu"),
                    GetIngredient("Rice"),
                    GetIngredient("Broccoli"),
                    GetIngredient("Carrot"),
                    GetIngredient("Soy Sauce"),
                    GetIngredient("Sesame Oil")
                }
            },

            new()
            {
                Id = Guid.NewGuid(),
                Name = "Fruit Smoothie",
                ImageUrl = "/images/recipes/smoothie.jpg",
                DurationMinutes = 3,
                Price = 2.50m,
                Rating = 4.2,
                Ingredients =
                {
                    GetIngredient("Banana"),
                    GetIngredient("Strawberries"),
                    GetIngredient("Greek Yogurt"),
                    GetIngredient("Milk"),
                    GetIngredient("Honey")
                }
            }
        };

        await context.Recipes.AddRangeAsync(recipes);
        await context.SaveChangesAsync();
        return;

        Ingredient GetIngredient(string name) =>
            ingredients.First(i => i.Name == name);
    }
}