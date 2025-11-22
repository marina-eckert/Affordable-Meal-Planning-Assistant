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
        DateOnly weekStart)
    {
        weekStart = weekStart.AddDays(-(int)weekStart.DayOfWeek + (weekStart.DayOfWeek == DayOfWeek.Sunday ? -6 : 1));

        var recipes = await _context.Recipes.ToListAsync();

        var mealPlan = new MealPlan
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            WeekStart = weekStart,
        };

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
                var recipe = recipes[_random.Next(recipes.Count)];

                day.Items.Add(new MealPlanDayItem
                {
                    Id = Guid.NewGuid(),
                    MealType = mealType,
                    RecipeId = recipe.Id
                });
            }

            mealPlan.Days.Add(day);
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
        return new RecipeDto(recipe.Id, recipe.Name, recipe.ImageUrl, recipe.DurationMinutes, recipe.Price,
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