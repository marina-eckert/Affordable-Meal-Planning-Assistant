using Microsoft.EntityFrameworkCore;
using MPA.API.Constants;
using MPA.API.Entities;
using MPA.API.Interfaces;
using MPA.API.Persistence.Context;
using MPA.API.Persistence.Seeding;
using MPA.API.Services;
using MPA.API.Settings;

namespace MPA.API;

public static class DependencyRegistrar
{
    public static void ConfigureApplicationDependencies(
        this IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IIngredientService, IngredientService>();
        services.AddScoped<IRecipeService, RecipeService>();
        services.AddScoped<IGroceryItemService, GroceryItemervice>();
        services.AddScoped<IMealService, MealService>();

        services.ConfigureOptions<JwtSettingsSetup>();
    }
    
    public static void ConfigurePersistenceDependencies(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddScoped<IEntitySeeder, IngredientSeeder>();
        services.AddScoped<IDatabaseSeeder, DatabaseSeeder>();
        services.AddScoped<IEntitySeeder, RecipeSeeder>();
        services.ConfigureAppDbContext(configuration);
        services.ConfigureIdentity();
    }

    private static void ConfigureAppDbContext(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(config =>
        {
            config.UseSqlServer(configuration.GetConnectionString(ConfigurationKeys.DbConnectionString));
        });
    }

    private static void ConfigureIdentity(
        this IServiceCollection services)
    {
        services.AddIdentity<User, Role>(config =>
        {
            config.Password.RequireDigit = false;
            config.Password.RequireUppercase = false;
            config.Password.RequireLowercase = false;
            config.Password.RequireNonAlphanumeric = false;
            config.User.RequireUniqueEmail = true;
        })
            .AddEntityFrameworkStores<AppDbContext>();
    }
}