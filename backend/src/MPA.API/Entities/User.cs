using Microsoft.AspNetCore.Identity;
using MPA.API.Enums;

namespace MPA.API.Entities;

public class User : IdentityUser<Guid>
{
    public DietaryPreference DietaryPreference { get; set; }
    public decimal WeeklyBudgetInDollars { get; set; }
}