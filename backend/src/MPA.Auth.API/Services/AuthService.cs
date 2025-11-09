using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using MPA.Auth.API.DTOs;
using MPA.Auth.API.Entities;
using MPA.Auth.API.Interfaces.Application;
using MPA.Auth.API.Settings;

namespace MPA.Auth.API.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly JwtSettings _jwtSettings;

    public AuthService(
        UserManager<User> userManager, 
        SignInManager<User> signInManager,
        IOptions<JwtSettings> jwtSettings)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _jwtSettings = jwtSettings.Value;
    }

    public async Task<JwtTokenResponseDto> UserLoginAsync(
        UserLoginDto userLoginDto)
    {
        var user = await _userManager.FindByEmailAsync(userLoginDto.Email);
        if (user is null)
        {
            throw new ApplicationException("User was not found");
        }

        var signInResult = await _signInManager.PasswordSignInAsync(user, userLoginDto.Password, false, false);
        if (!signInResult.Succeeded)
        {
            throw new ApplicationException("Incorrect email or password");
        }

        var authToken = await GenerateJwtTokenAsync(user);
        
        return new JwtTokenResponseDto(authToken);
    }

    public async Task UserSignupAsync(
        UserSignupDto userSignupDto)
    {
        var existingUser = await _userManager.FindByEmailAsync(userSignupDto.Email);
        if (existingUser is not null)
        {
            throw new ApplicationException("User with this email already exists");
        }
        
        var user = new User
        {
            UserName = userSignupDto.UserName,
            Email = userSignupDto.Email
        };

        var signUpResult = await _userManager.CreateAsync(user, userSignupDto.Password);
        if (!signUpResult.Succeeded)
        {
            throw new ApplicationException(string.Join('.', signUpResult.Errors.Select(x => x.Description)));
        }
    }
    
    private async Task<string> GenerateJwtTokenAsync(User user)
    {
        var authClaims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Email, user.Email!),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
        };

        var roles = await _userManager.GetRolesAsync(user);
        authClaims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));

        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            expires: DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiresInMinutes),
            claims: authClaims,
            signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}