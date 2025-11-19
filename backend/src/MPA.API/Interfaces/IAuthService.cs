using MPA.API.DTOs;

namespace MPA.API.Interfaces;

public interface IAuthService
{
    Task<JwtTokenResponseDto> UserLoginAsync(UserLoginDto userLoginDto);
    
    Task UserSignupAsync(UserSignupDto userSignupDto);
}