using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MPA.API;
using MPA.API.DTOs;
using MPA.API.Interfaces;
using MPA.API.Persistence.Context;

var builder = WebApplication.CreateBuilder(args);

builder.Services.ConfigureApplicationDependencies();
builder.Services.ConfigurePersistenceDependencies(builder.Configuration);

builder.Services
    .AddAuthorization()
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var jwt = builder.Configuration.GetSection("JwtSettings");
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwt["Issuer"],
            ValidAudience = jwt["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwt["Key"]!))
        };
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new() { Title = "MPA API", Version = "v1" });
    
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Description = "Enter: Bearer {your JWT token}",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    });

    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();

    var seeder = scope.ServiceProvider.GetRequiredService<IDatabaseSeeder>();
    await seeder.SeedAsync();
}

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "MPA Auth API v1");
    c.RoutePrefix = string.Empty;
});

app.UseAuthentication();
app.UseAuthorization();

app.MapPost("/api/auth/login", async (
    [FromBody] UserLoginDto userLoginDto, IAuthService authService) =>
{
    var tokenResponse = await authService.UserLoginAsync(userLoginDto);
    return Results.Ok(tokenResponse);
})
.WithName("Login")
.WithTags("Auth");

app.MapPost("/api/auth/signup", async (
    [FromBody] UserSignupDto userSignupDto, IAuthService authService) =>
{
    await authService.UserSignupAsync(userSignupDto);
    return Results.NoContent();
})
.WithName("Signup")
.WithTags("Auth");

app.MapGet("/api/users/{id}", async (
    [FromRoute] Guid id, IUserService userService) =>
{
    var user = await userService.GetUserByIdAsync(id);
    return Results.Ok(user);
});

app.MapPut("/api/users/{id}", async (
    [FromRoute] Guid id,
    [FromBody] UpdateUserDto updateUserDto,
    IUserService userService) =>
{
    await userService.UpdateUserAsync(id, updateUserDto);
    return Results.NoContent();
});

app.MapGet("/api/ingredients", async (IIngredientService ingredientService) =>
    {
        var ingredients = await ingredientService.GetIngredientsAsync();
        return Results.Ok(ingredients);
    })
    .WithName("GetIngredients")
    .WithTags("Ingredients")
    .WithSummary("Returns all ingredients.")
    .WithDescription("Fetches the complete list of available ingredients that can be used in recipes.")
    .Produces<List<IngredientDto>>();

app.MapGet("/api/recipes", async (IRecipeService recipeService) =>
    {
        var recipes = await recipeService.GetRecipesAsync();
        return Results.Ok(recipes);
    })
    .WithName("GetRecipes")
    .WithTags("Recipes")
    .WithSummary("Returns all recipes.")
    .WithDescription("Returns all recipes including their ingredients.")
    .Produces<List<RecipeDto>>();

app.MapGet("/api/users/{userId}/grocery-list", async (Guid userId, IGroceryItemService groceryItemService) =>
    {
        var groceryItems = await groceryItemService.GetGroceryItemsByUserIdAsync(userId);
        return Results.Ok(groceryItems);
    })
    .WithName("GetUserGroceryItems")
    .WithTags("GroceryItems")
    .WithSummary("Returns the user's grocery items.")
    .WithDescription("Fetches all grocery items (ingredients and quantities) for the specified user.")
    .Produces<List<GroceryItemDto>>();

app.MapPost("/api/users/{userId}/grocery-list",
        async (Guid userId, AddGroceryItemDto addDto, IGroceryItemService groceryItemService) =>
        {
            await groceryItemService.AddGroceryItemAsync(userId, addDto);
            return Results.NoContent();
        })
    .WithName("AddGroceryItem")
    .WithTags("GroceryItems")
    .WithSummary("Adds a new grocery item to the user's list.")
    .WithDescription("Adds an ingredient with a specified quantity to the user's grocery list.");

app.MapPut("/api/grocery-list/items/{id}", async (Guid id, UpdateGroceryItemDto updateDto, IGroceryItemService groceryItemService) =>
    {
        await groceryItemService.UpdateGroceryItemAsync(id, updateDto);
        return Results.NoContent();
    })
    .WithName("UpdateGroceryItem")
    .WithTags("GroceryItems")
    .WithSummary("Updates a grocery item's quantity.")
    .WithDescription("Updates the quantity of a grocery item in the user's list.");

app.MapDelete("/api/grocery-list/items/{id}", async (Guid id, IGroceryItemService groceryItemService) =>
    {
        await groceryItemService.DeleteGroceryItemAsync(id);
        return Results.NoContent();
    })
    .WithName("DeleteGroceryItem")
    .WithTags("GroceryItems")
    .WithSummary("Deletes a grocery item from the user's list.")
    .WithDescription("Removes a grocery item from the user's list by ID.");

app.MapGet("/api/users/{userId}/mealplan", async (Guid userId, DateOnly weekStart, IMealService mealService) =>
    {
        var mealPlan = await mealService.GetMealPlanAsync(userId, weekStart);
        return Results.Ok(mealPlan);
    })
    .WithName("GetMealPlan")
    .WithTags("MealPlan")
    .WithSummary("Gets a user's meal plan for a week.")
    .WithDescription("Fetches the meal plan for the specified week. If it does not exist, an empty plan is returned.")
    .Produces<MealPlanDto>();

app.MapPost("/api/users/{userId}/mealplan/random", async (Guid userId, DateOnly weekStart, IMealService mealService) =>
    {
        var mealPlan = await mealService.GenerateRandomMealPlanAsync(userId, weekStart);
        return Results.Ok(mealPlan);
    })
    .WithName("GenerateRandomMealPlan")
    .WithTags("MealPlan")
    .WithSummary("Generates a random meal plan for a user for a week.")
    .WithDescription("Generates and saves a random meal plan for the specified week using recipes from the system.")
    .Produces<MealPlanDto>();

app.MapPost("/api/users/{userId}/mealplan/item", async (
        Guid userId,
        AddMealPlanDayItemDto addDto,
        IMealService mealService) =>
    {
        var mealItem = await mealService.AddMealPlanDayItemAsync(userId, addDto);
        return Results.Ok(mealItem);
    })
    .WithName("AddMealPlanDayItem")
    .WithTags("MealPlan")
    .WithSummary("Adds a meal to a specific day in a user's meal plan.")
    .WithDescription("Adds a new meal item for a specific day and meal type. If the day does not exist, it will be created automatically.")
    .Produces<MealPlanDayItemDto>();

app.MapPut("/api/mealplan/items/{mealPlanDayItemId}", async (
        Guid mealPlanDayItemId,
        Guid newRecipeId,
        IMealService mealService) =>
    {
        await mealService.UpdateMealPlanDayItemAsync(mealPlanDayItemId, newRecipeId);
        return Results.NoContent();
    })
    .WithName("UpdateMealPlanDayItem")
    .WithTags("MealPlan")
    .WithSummary("Updates a meal plan item with a new recipe.")
    .WithDescription("Updates the recipe of a specific meal plan item.");

app.MapDelete("/api/mealplan/items/{mealPlanDayItemId}", async (
        Guid mealPlanDayItemId,
        IMealService mealService) =>
    {
        await mealService.DeleteMealPlanDayItemAsync(mealPlanDayItemId);
        return Results.NoContent();
    })
    .WithName("DeleteMealPlanDayItem")
    .WithTags("MealPlan")
    .WithSummary("Deletes a meal plan item from a user's meal plan.")
    .WithDescription("Removes a specific meal plan item by ID.");

app.MapDelete("/api/mealplan/{mealPlanId}", async (
        Guid mealPlanId,
        IMealService mealService) =>
    {
        await mealService.DeleteMealPlanAsync(mealPlanId);
        return Results.NoContent();
    })
    .WithName("DeleteMealPlan")
    .WithTags("MealPlan")
    .WithSummary("Deletes an entire meal plan.")
    .WithDescription("Deletes a full meal plan including all days and items by meal plan ID.");

app.Run();
