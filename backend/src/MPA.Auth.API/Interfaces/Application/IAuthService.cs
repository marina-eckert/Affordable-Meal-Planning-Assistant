using MPA.Auth.API.DTOs;

namespace MPA.Auth.API.Interfaces.Application;

public interface IAuthService
{
    Task<JwtTokenResponseDto> UserLoginAsync(UserLoginDto userLoginDto);
    
    Task UserSignupAsync(UserSignupDto userSignupDto);
}