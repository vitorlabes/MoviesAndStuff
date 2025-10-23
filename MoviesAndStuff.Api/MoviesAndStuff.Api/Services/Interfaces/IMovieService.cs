using MoviesAndStuff.Api.Data.Dtos;
using MoviesAndStuff.Api.Data.Enums;
using MoviesAndStuff.Api.Models;

namespace MoviesAndStuff.Api.Services.Interfaces
{
    public interface IMovieService
    {
        Task<List<MovieListDto>> GetMovieListAsync(string? search, string? genreId, WatchFilter watchFilter);
        Task<Movie?> GetByIdAsync(long id);
        Task<Movie?> CreateAsync(Movie movie);
        Task UpdateAsync(Movie movie);
        Task<bool> ToggleWatchedAsync(long id);
        Task<bool> DeleteAsync(long id);
        Task<List<Genre>> GetGenresList();
    }
}
