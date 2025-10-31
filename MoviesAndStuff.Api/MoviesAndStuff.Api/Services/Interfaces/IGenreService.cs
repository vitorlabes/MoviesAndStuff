using MoviesAndStuff.Api.Data.Dtos;
using MoviesAndStuff.Api.Data.Dtos.Genres;

namespace MoviesAndStuff.Api.Services.Interfaces
{
    public interface IGenreService
    {
        Task<List<GenreListDto>> GetAllAsync(string? mediaTypeId = null, bool? isActive = null);
        Task<GenreDetailDto?> GetByIdAsync(long id);
        Task<GenreDetailDto> CreateAsync(CreateGenreDto dto);
        Task<bool> UpdateAsync(long id, UpdateGenreDto dto);
        Task<bool> DeleteAsync(long id);
        Task<bool> ExistsAsync(long id);
    }
}
