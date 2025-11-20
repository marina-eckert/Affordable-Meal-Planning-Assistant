using MPA.API.Entities;
using MPA.API.Interfaces;
using MPA.API.Persistence.Context;

namespace MPA.API.Persistence.Seeding;

public class IngredientSeeder : IEntitySeeder
{
    public async Task SeedAsync(AppDbContext context)
    {
        if (context.Ingredients.Any())
        {
            return;
        }
        
        var ingredients = new List<Ingredient>
        {
            // MEAT
            New("Chicken Breast"), New("Chicken Thigh"),
            New("Ground Beef"), New("Beef Steak"),
            New("Pork Loin"), New("Pork Belly"),
            New("Turkey Breast"), New("Bacon"),
            New("Ham"), New("Sausage"),

            // FISH & SEAFOOD
            New("Salmon"), New("Tuna"),
            New("Cod"), New("Shrimp"),
            New("Mussels"), New("Crab Meat"),
            New("Sardines"), New("Anchovies"),

            // VEGETABLES
            New("Carrot"), New("Onion"), New("Garlic"), New("Potato"),
            New("Sweet Potato"), New("Tomato"), New("Cucumber"),
            New("Bell Pepper"), New("Broccoli"), New("Cauliflower"),
            New("Spinach"), New("Kale"), New("Lettuce"), New("Zucchini"),
            New("Eggplant"), New("Green Beans"), New("Peas"), New("Corn"),
            New("Celery"), New("Mushrooms"), New("Leek"), New("Ginger"),
            New("Chili Pepper"), New("Cabbage"), New("Red Onion"),

            // FRUITS
            New("Apple"), New("Banana"), New("Orange"), New("Lemon"),
            New("Lime"), New("Strawberries"), New("Blueberries"),
            New("Pineapple"), New("Mango"), New("Peach"),
            New("Grapes"), New("Avocado"), New("Kiwi"),

            // GRAINS & PASTA
            New("Rice"), New("Brown Rice"),
            New("Quinoa"), New("Couscous"),
            New("Oats"), New("Barley"),
            New("Spaghetti"), New("Penne"), New("Noodles"),

            // LEGUMES
            New("Lentils"), New("Red Lentils"),
            New("Chickpeas"), New("Black Beans"),
            New("Kidney Beans"), New("Green Lentils"),
            New("Soybeans"),

            // DAIRY
            New("Milk"), New("Cream"), New("Butter"),
            New("Yogurt"), New("Greek Yogurt"),
            New("Cheddar Cheese"), New("Mozzarella"),
            New("Parmesan"), New("Cottage Cheese"),
            New("Sour Cream"), New("Feta Cheese"),

            // EGGS
            New("Eggs"),

            // OILS & FATS
            New("Olive Oil"), New("Vegetable Oil"),
            New("Coconut Oil"), New("Sesame Oil"),
            New("Avocado Oil"), New("Butter Ghee"),

            // NUTS & SEEDS
            New("Almonds"), New("Walnuts"),
            New("Cashews"), New("Peanuts"),
            New("Chia Seeds"), New("Pumpkin Seeds"),
            New("Sunflower Seeds"), New("Flax Seeds"),

            // SPICES
            New("Salt"), New("Black Pepper"),
            New("Paprika"), New("Cumin"), New("Coriander"),
            New("Turmeric"), New("Oregano"), New("Basil"),
            New("Rosemary"), New("Thyme"), New("Cinnamon"),
            New("Nutmeg"), New("Cloves"), New("Curry Powder"),
            New("Chili Powder"), New("Garlic Powder"),
            New("Onion Powder"), New("Bay Leaf"),

            // SAUCES & CONDIMENTS
            New("Soy Sauce"), New("Tomato Sauce"),
            New("Ketchup"), New("Mayonnaise"),
            New("Mustard"), New("Barbecue Sauce"),
            New("Hot Sauce"), New("Vinegar"),
            New("Balsamic Vinegar"), New("Honey"),

            // BAKING
            New("Flour"), New("Sugar"),
            New("Brown Sugar"), New("Baking Powder"),
            New("Baking Soda"), New("Cocoa Powder"),
            New("Yeast"),

            // MISC
            New("Tofu"), New("Vegetable Broth"),
            New("Chicken Broth"), New("Beef Broth")
        };

        await context.Ingredients.AddRangeAsync(ingredients);
        await context.SaveChangesAsync();
    }
    
    private static Ingredient New(string name) => new() { Id = Guid.NewGuid(), Name = name };
}