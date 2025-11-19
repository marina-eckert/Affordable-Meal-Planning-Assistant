using MPA.API.Enums;

namespace MPA.API.DTOs;

public record UpdateUserDto(
    string UserName,
    string Email,
    DietaryPreference DietaryPreference,
    decimal WeeklyBudgetInDollars);