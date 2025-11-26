namespace MoviesAndStuff.Api.Services.Interfaces
{
    /// <summary>
    /// Base interface for media services
    /// Defines common operations for all media types
    /// </summary>
    /// <typeparam name="TListDto">DTO for list operations</typeparam>
    /// <typeparam name="TDetailDto">DTO for detail operations</typeparam>
    /// <typeparam name="TFormDto">DTO for create/update operations</typeparam>
    /// <typeparam name="TFilter">Filter type (can be enum or nullable)</typeparam>
    public interface IBaseMediaService<TListDto, TDetailDto, TFormDto, TFilter>
    {
        Task<List<TListDto>> GetAllAsync(string? search, long? genreId, TFilter? filter);
        Task<TDetailDto?> GetByIdAsync(long id);
        Task<TDetailDto> CreateAsync(TFormDto dto);
        Task<bool> UpdateAsync(long id, TFormDto dto);
        Task<bool> ToggleStatusAsync(long id);
        Task<bool> DeleteAsync(long id);
    }
}
