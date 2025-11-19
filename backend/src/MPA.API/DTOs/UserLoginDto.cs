namespace MPA.API.DTOs;

public record UserLoginDto(
    string Email,
    string Password);