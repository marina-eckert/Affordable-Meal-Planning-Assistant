namespace MPA.API.DTOs;

public record JwtTokenResponseDto(
    Guid UserId,
    string Token);