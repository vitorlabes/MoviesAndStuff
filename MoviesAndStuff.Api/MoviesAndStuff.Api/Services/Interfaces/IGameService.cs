using MoviesAndStuff.Api.Data.Dtos.Games;

namespace MoviesAndStuff.Api.Services.Interfaces
{
    public interface IGameService
    {
        Task<List<GameListDto>> GetAllAsync(string? search, long? genreId);
        Task<GameDetailDto?> GetByIdAsync(long id);
        Task<GameDetailDto> CreateAsync(CreateGameDto dto);
        Task<bool> UpdateAsync(long id, UpdateGameDto dto);
        Task<bool> TogglePlayedAsync(long id);
        Task<bool> DeleteAsync(long id);
    }
}
