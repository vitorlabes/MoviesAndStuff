using MoviesAndStuff.Api.Data.Dtos;
using MoviesAndStuff.Api.Data.Dtos.Genres;

namespace MoviesAndStuff.Api.Services.Interfaces
{
    public interface IGenreService
    {
        Task<List<GenreListDto>> GetAllAsync(string? mediaTypeId = null, bool? isActive = null);
        Task<GenreDetailDto?> GetByIdAsync(long id);
        Task<GenreDetailDto> CreateAsync(GenreFormDto dto);
        Task<bool> UpdateAsync(long id, GenreFormDto dto);
        Task<bool> DeleteAsync(long id);
        Task<bool> ExistsAsync(long id);
        Task<List<MediaTypeListDto>> GetAllMediaTypes();
    }
}
