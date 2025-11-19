namespace MPA.API.DTOs;

public record UserSignupDto(
    string UserName,
    string Email,
    string Password);