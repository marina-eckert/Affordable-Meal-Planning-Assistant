using Microsoft.EntityFrameworkCore;
using MPA.API.DTOs;
using MPA.API.Entities;
using MPA.API.Enums;
using MPA.API.Interfaces;
using MPA.API.Persistence.Context;

namespace MPA.API.Services;

public class MealService : IMealService
{
    private readonly AppDbContext _context;
    private readonly Random _random = new();

    public MealService(AppDbContext context)
    {
        _context = context;
    }
    
    public async Task<MealPlanDto> GetMealPlanAsync(
        Guid userId, 
        DateOnly weekStart)
    {
        weekStart = weekStart.AddDays(-(int)weekStart.DayOfWeek + (weekStart.DayOfWeek == DayOfWeek.Sunday ? -6 : 1));

        var mealPlan = await _context.MealPlans
            .Include(x => x.Days)
                .ThenInclude(x => x.Items)
                    .ThenInclude(x => x.Recipe)
            .FirstOrDefaultAsync(x => x.UserId == userId && x.WeekStart == weekStart);
        return mealPlan is null ? 
            new MealPlanDto(Guid.Empty, weekStart, userId, []) :
            MapToModel(mealPlan);
    }
    
    public async Task<MealPlanDto> GenerateRandomMealPlanAsync(
        Guid userId, 
        DateOnly weekStart,
        decimal? budget = null)
    {
        weekStart = weekStart.AddDays(-(int)weekStart.DayOfWeek + (weekStart.DayOfWeek == DayOfWeek.Sunday ? -6 : 1));

        var recipes = await _context.Recipes.ToListAsync();
        
        // Group recipes by category
        var breakfastRecipes = recipes.Where(r => r.Category?.Equals("Breakfast", StringComparison.OrdinalIgnoreCase) ?? false).ToList();
        var lunchRecipes = recipes.Where(r => r.Category?.Equals("Lunch", StringComparison.OrdinalIgnoreCase) ?? false).ToList();
        var dinnerRecipes = recipes.Where(r => r.Category?.Equals("Dinner", StringComparison.OrdinalIgnoreCase) ?? false).ToList();

        // Fallback
        if (breakfastRecipes.Count == 0) breakfastRecipes = recipes;
        if (lunchRecipes.Count == 0) lunchRecipes = recipes;
        if (dinnerRecipes.Count == 0) dinnerRecipes = recipes;

        var mealPlan = new MealPlan
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            WeekStart = weekStart,
        };

        var allSelectedItems = new List<(MealPlanDayItem Item, decimal Price, string Category)>();

        // Helper to get a random unique sequence of recipes
        Queue<Recipe> GetShuffledQueue(List<Recipe> source)
        {
            return new Queue<Recipe>(source.OrderBy(_ => _random.Next()));
        }

        var breakfastQueue = GetShuffledQueue(breakfastRecipes);
        var lunchQueue = GetShuffledQueue(lunchRecipes);
        var dinnerQueue = GetShuffledQueue(dinnerRecipes);

        Recipe GetNextRecipe(Queue<Recipe> queue, List<Recipe> source)
        {
            if (queue.Count == 0)
            {
                // Reshuffle if we ran out
                foreach (var r in source.OrderBy(_ => _random.Next())) queue.Enqueue(r);
            }
            return queue.Dequeue();
        }

        for (var i = 0; i < 7; i++)
        {
            var date = weekStart.AddDays(i);
            var day = new MealPlanDay
            {
                Id = Guid.NewGuid(),
                Date = date
            };

            foreach (MealType mealType in Enum.GetValues(typeof(MealType)))
            {
                Recipe recipe;
                string category;
                switch (mealType)
                {
                    case MealType.Breakfast:
                        recipe = GetNextRecipe(breakfastQueue, breakfastRecipes);
                        category = "Breakfast";
                        break;
                    case MealType.Lunch:
                        recipe = GetNextRecipe(lunchQueue, lunchRecipes);
                        category = "Lunch";
                        break;
                    case MealType.Dinner:
                        recipe = GetNextRecipe(dinnerQueue, dinnerRecipes);
                        category = "Dinner";
                        break;
                    default:
                        recipe = recipes[_random.Next(recipes.Count)];
                        category = "Other";
                        break;
                }

                var item = new MealPlanDayItem
                {
                    Id = Guid.NewGuid(),
                    MealType = mealType,
                    RecipeId = recipe.Id
                };
                
                day.Items.Add(item);
                allSelectedItems.Add((item, recipe.Price, category));
            }

            mealPlan.Days.Add(day);
        }

        // Budget Optimization
        if (budget.HasValue)
        {
            var totalCost = allSelectedItems.Sum(x => x.Price);
            var maxIterations = 200; 
            var iteration = 0;

            while (totalCost > budget.Value && iteration < maxIterations)
            {
                // Sort items by price descending to find candidates to swap out
                var sortedItems = allSelectedItems.OrderByDescending(x => x.Price).ToList();
                bool swapped = false;

                foreach (var (item, currentPrice, category) in sortedItems)
                {
                    // Find cheaper alternatives in the same category
                    List<Recipe> candidates = category switch
                    {
                        "Breakfast" => breakfastRecipes,
                        "Lunch" => lunchRecipes,
                        "Dinner" => dinnerRecipes,
                        _ => recipes
                    };

                    // Filter for strictly cheaper items
                    var cheaperOptions = candidates
                        .Where(r => r.Price < currentPrice)
                        .OrderBy(r => r.Price) // Try the cheapest ones first to reduce cost fast
                        .ToList();

                    if (cheaperOptions.Count > 0)
                    {
                        // Try to find one that isn't already used to maintain variety
                        var usedRecipeIds = allSelectedItems.Select(x => x.Item.RecipeId).ToHashSet();
                        var bestOption = cheaperOptions.FirstOrDefault(r => !usedRecipeIds.Contains(r.Id));

                        // If all cheaper options are already used, just pick the absolute cheapest to satisfy budget
                        if (bestOption == null)
                        {
                            bestOption = cheaperOptions.First();
                        }

                        // Perform Swap
                        item.RecipeId = bestOption.Id;
                        
                        // Update tracking list
                        allSelectedItems.RemoveAll(x => x.Item == item);
                        allSelectedItems.Add((item, bestOption.Price, category));
                        
                        totalCost = allSelectedItems.Sum(x => x.Price);
                        swapped = true;
                        break; // Restart loop to re-evaluate with new total
                    }
                }

                if (!swapped)
                {
                    // If we iterated through all items and couldn't find ANY cheaper alternative for ANY item, we are stuck.
                    break; 
                }

                iteration++;
            }
        }

        await _context.MealPlans.AddAsync(mealPlan);
        await _context.SaveChangesAsync();

        await _context.Entry(mealPlan)
            .Collection(mp => mp.Days)
            .Query()
            .Include(d => d.Items)
            .ThenInclude(i => i.Recipe)
            .LoadAsync();

        return MapToModel(mealPlan);
    }
    
    public async Task<MealPlanDayItemDto> AddMealPlanDayItemAsync(
    Guid userId, 
    AddMealPlanDayItemDto addMealPlanDayItemDto)
{
    var weekStart = addMealPlanDayItemDto.Date
        .AddDays(-(int)addMealPlanDayItemDto.Date.DayOfWeek + (addMealPlanDayItemDto.Date.DayOfWeek == DayOfWeek.Sunday ? -6 : 1));

    var mealPlan = await _context.MealPlans
        .Include(mp => mp.Days)
        .ThenInclude(d => d.Items)
        .FirstOrDefaultAsync(mp => mp.UserId == userId && mp.WeekStart == weekStart);

    if (mealPlan is null)
    {
        mealPlan = new MealPlan
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            WeekStart = weekStart
        };
        _context.MealPlans.Add(mealPlan);
        await _context.SaveChangesAsync(); // Save meal plan first
    }

    var day = mealPlan.Days.FirstOrDefault(d => d.Date == addMealPlanDayItemDto.Date);
    if (day is null)
    {
        day = new MealPlanDay
        {
            Id = Guid.NewGuid(),
            Date = addMealPlanDayItemDto.Date,
            MealPlanId = mealPlan.Id
        };
        _context.MealPlanDays.Add(day);
        await _context.SaveChangesAsync(); // Save day first
    }

    var recipe = await _context.Recipes
        .Include(r => r.Ingredients)
        .FirstOrDefaultAsync(r => r.Id == addMealPlanDayItemDto.RecipeId);
    
    if (recipe is null)
    {
        throw new ApplicationException("Recipe was not found.");
    }

    var mealItem = new MealPlanDayItem
    {
        Id = Guid.NewGuid(),
        MealType = addMealPlanDayItemDto.MealType,
        RecipeId = addMealPlanDayItemDto.RecipeId,
        MealPlanDayId = day.Id
    };
    
    _context.MealPlanDayItems.Add(mealItem);
    await _context.SaveChangesAsync();

    return new MealPlanDayItemDto(
        mealItem.Id,
        mealItem.MealType,
        mealItem.MealPlanDayId,
        MapToModel(recipe));
}
    
    public async Task UpdateMealPlanDayItemAsync(
        Guid mealPlanDayItemId, 
        Guid newRecipeId)
    {
        var mealItem = await _context.MealPlanDayItems
            .Include(i => i.Recipe)
            .FirstOrDefaultAsync(i => i.Id == mealPlanDayItemId);

        if (mealItem is null)
        {
            throw new ApplicationException("Meal item was not found.");
        }
        
        var recipe = await _context.Recipes.FindAsync(newRecipeId);
        if (recipe is null)
        {
            throw new ApplicationException("Recipe was not found.");
        }
        
        mealItem.RecipeId = newRecipeId;
        
        _context.MealPlanDayItems.Update(mealItem);
        await _context.SaveChangesAsync();
    }
    
    public async Task DeleteMealPlanDayItemAsync(Guid mealPlanDayItemId)
    {
        var mealItem = await _context.MealPlanDayItems.FindAsync(mealPlanDayItemId);
        if (mealItem is null)
        {
            throw new ApplicationException("Meal item was not found.");
        }

        _context.MealPlanDayItems.Remove(mealItem);
        await _context.SaveChangesAsync();
    }
    
    public async Task DeleteMealPlanAsync(Guid mealPlanId)
    {
        var mealPlan = await _context.MealPlans
            .Include(mp => mp.Days)
            .ThenInclude(d => d.Items)
            .FirstOrDefaultAsync(mp => mp.Id == mealPlanId);

        if (mealPlan is null)
        {
            throw new ApplicationException("Meal plan was not found.");
        }

        _context.MealPlans.Remove(mealPlan);
        await _context.SaveChangesAsync();
    }

    private static MealPlanDto MapToModel(MealPlan mealPlan)
    {
        return new MealPlanDto(mealPlan.Id, mealPlan.WeekStart, mealPlan.UserId, MapToModels(mealPlan.Days).ToList());
    }

    private static RecipeDto MapToModel(Recipe recipe)
    {
        return new RecipeDto(recipe.Id, recipe.Name, recipe.Category, recipe.ImageUrl, recipe.DurationMinutes, recipe.Price,
            recipe.Rating, []);
    }

    private static IEnumerable<MealPlanDayDto> MapToModels(IEnumerable<MealPlanDay> mealPlanDays)
    {
        return mealPlanDays.Select(x => new MealPlanDayDto(x.Id, x.Date, x.MealPlanId, MapToModels(x.Items).ToList()));
    }

    private static IEnumerable<MealPlanDayItemDto> MapToModels(IEnumerable<MealPlanDayItem> mealPlanDayItems)
    {
        return mealPlanDayItems.Select(x => new MealPlanDayItemDto(x.Id, x.MealType, x.MealPlanDayId, MapToModel(x.Recipe)));
    }
}