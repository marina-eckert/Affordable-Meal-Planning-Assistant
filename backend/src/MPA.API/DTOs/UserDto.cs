using MPA.API.Enums;

namespace MPA.API.DTOs;

public record UserDto(
    Guid Id,
    string Email,
    string UserName,
    DietaryPreference DietaryPreference,
    decimal WeeklyBudgetInDollars);