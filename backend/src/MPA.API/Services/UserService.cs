using Microsoft.EntityFrameworkCore;
using MPA.API.DTOs;
using MPA.API.Interfaces;
using MPA.API.Persistence.Context;

namespace MPA.API.Services;

public class UserService : IUserService
{
    private readonly AppDbContext _dbContext;

    public UserService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<UserDto> GetUserByIdAsync(
        Guid id, 
        CancellationToken cancellationToken = default)
    {
        var user = await _dbContext.Users.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (user is null)
        {
            throw new ApplicationException("User was not found.");
        }

        return new UserDto(user.Id, user.Email!, user.UserName!, user.DietaryPreference, user.WeeklyBudgetInDollars);
    }

    public async Task<UserDto> UpdateUserAsync(
        Guid id, 
        UpdateUserDto updateUserDto, 
        CancellationToken cancellationToken = default)
    {
        var user = await _dbContext.Users.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (user is null)
        {
            throw new ApplicationException("User was not found.");
        }
        
        var userWithTheSameEmail = await _dbContext.Users.FirstOrDefaultAsync(
            x => x.Email == updateUserDto.Email && x.Id != id, 
            cancellationToken);
        if (userWithTheSameEmail is not null)
        {
            throw new ApplicationException("User with this email already exists.");
        }

        user.UserName = updateUserDto.UserName;
        user.Email = updateUserDto.Email;
        user.DietaryPreference = updateUserDto.DietaryPreference;
        user.WeeklyBudgetInDollars = updateUserDto.WeeklyBudgetInDollars;

        _dbContext.Users.Update(user);

        await _dbContext.SaveChangesAsync(cancellationToken);
        
        return new UserDto(user.Id, user.Email!, user.UserName!, user.DietaryPreference, user.WeeklyBudgetInDollars);
    }
}