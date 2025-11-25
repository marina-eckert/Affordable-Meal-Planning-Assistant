namespace MPA.API.DTOs;

public record JwtTokenResponseDto(
    Guid UserId,
    string Token,
    string UserName,
    string? ProfilePictureUrl);