using MPA.API.DTOs;

namespace MPA.API.Interfaces;

public interface IUserService
{
    Task<UserDto> GetUserByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default);

    Task<UserDto> UpdateUserAsync(
        Guid id,
        UpdateUserDto updateUserDto,
        CancellationToken cancellationToken = default);
    Task UpdateUserProfilePictureAsync(Guid id, string profilePictureUrl, CancellationToken cancellationToken = default);
}