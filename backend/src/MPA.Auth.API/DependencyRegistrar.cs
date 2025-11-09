using Microsoft.EntityFrameworkCore;
using MPA.Auth.API.Constants;
using MPA.Auth.API.Entities;
using MPA.Auth.API.Interfaces.Application;
using MPA.Auth.API.Persistence.Context;
using MPA.Auth.API.Services;
using MPA.Auth.API.Settings;

namespace MPA.Auth.API;

public static class DependencyRegistrar
{
    public static void ConfigureApplicationDependencies(
        this IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>();

        services.ConfigureOptions<JwtSettingsSetup>();
    }
    
    public static void ConfigurePersistenceDependencies(
        this IServiceCollection services,
        IConfiguration configuration)
    {
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