namespace MPA.Auth.API.DTOs;

public record UserLoginDto(
    string Email,
    string Password);