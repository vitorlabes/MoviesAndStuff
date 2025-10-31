using MoviesAndStuff.Api.Data.Dtos.Movies;
using MoviesAndStuff.Api.Data.Enums;

namespace MoviesAndStuff.Api.Services.Interfaces
{
    public interface IMovieService
    {
        Task<List<MovieListDto>> GetAllAsync(string? search, long? genreId, WatchFilter watchFilter);
        Task<MovieDetailDto?> GetByIdAsync(long id);
        Task<MovieDetailDto> CreateAsync(CreateMovieDto dto);
        Task<bool> UpdateAsync(long id, UpdateMovieDto dto);
        Task<bool> ToggleWatchedAsync(long id);
        Task<bool> DeleteAsync(long id);
    }
}
