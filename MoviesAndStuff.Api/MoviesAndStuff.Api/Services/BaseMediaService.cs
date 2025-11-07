using Microsoft.EntityFrameworkCore;
using MoviesAndStuff.Api.Data;
using MoviesAndStuff.Api.Services.Interfaces;
using System.Linq.Expressions;

namespace MoviesAndStuff.Api.Services
{
    /// <summary>
    /// Base service class for media entities
    /// Implements common CRUD operations with template method pattern
    /// </summary>
    public abstract class BaseMediaService<TEntity, TListDto, TDetailDto, TCreateDto, TUpdateDto, TFilter>
        : IBaseMediaService<TListDto, TDetailDto, TCreateDto, TUpdateDto, TFilter>
        where TEntity : class
    {
        protected readonly AppDbContext Context;

        protected BaseMediaService(AppDbContext context)
        {
            Context = context;
        }

        /// <summary>
        /// Gets all media items with optional filtering
        /// </summary>
        public virtual async Task<List<TListDto>> GetAllAsync(string? search, long? genreId, TFilter? filter)
        {
            var query = GetBaseQuery();

            query = ApplySearchFilter(query, search);
            query = ApplyGenreFilter(query, genreId);
            query = ApplyCustomFilter(query, filter);

            return await query
                .Select(MapToListDto())
                .ToListAsync();
        }

        /// <summary>
        /// Gets a single media item by ID
        /// </summary>
        public virtual async Task<TDetailDto?> GetByIdAsync(long id)
        {
            TEntity? entity = await GetDetailQuery()
                .FirstOrDefaultAsync(e => EF.Property<long>(e, "Id") == id);

            return entity == null ? default : MapToDetailDto(entity);
        }

        /// <summary>
        /// Creates a new media item
        /// </summary>
        public virtual async Task<TDetailDto> CreateAsync(TCreateDto dto)
        {
            await ValidateCreateDto(dto);

            var entity = MapToEntity(dto);
            SetCreatedAt(entity);

            Context.Set<TEntity>().Add(entity);
            await Context.SaveChangesAsync();

            long id = GetEntityId(entity);
            return (await GetByIdAsync(id))!;
        }

        /// <summary>
        /// Updates an existing media item
        /// </summary>
        public virtual async Task<bool> UpdateAsync(long id, TUpdateDto dto)
        {
            TEntity? entity = await Context.Set<TEntity>().FindAsync(id);

            if (entity == null)
                return false;

            await ValidateUpdateDto(dto);

            UpdateEntityFromDto(entity, dto);

            await Context.SaveChangesAsync();
            return true;
        }

        /// <summary>
        /// Toggles the status (watched/played) of a media item
        /// </summary>
        public virtual async Task<bool> ToggleStatusAsync(long id)
        {
            TEntity? entity = await Context.Set<TEntity>().FindAsync(id);

            if (entity == null)
                return false;

            ToggleEntityStatus(entity);

            await Context.SaveChangesAsync();
            return true;
        }

        /// <summary>
        /// Deletes a media item
        /// </summary>
        public virtual async Task<bool> DeleteAsync(long id)
        {
            var entity = await Context.Set<TEntity>().FindAsync(id);

            if (entity == null)
                return false;

            Context.Set<TEntity>().Remove(entity);
            await Context.SaveChangesAsync();

            return true;
        }

        // Abstract methods to be implemented by derived classes
        protected abstract IQueryable<TEntity> GetBaseQuery();
        protected abstract IQueryable<TEntity> GetDetailQuery();
        protected abstract Expression<Func<TEntity, TListDto>> MapToListDto();
        protected abstract TDetailDto MapToDetailDto(TEntity entity);
        protected abstract TEntity MapToEntity(TCreateDto dto);
        protected abstract void UpdateEntityFromDto(TEntity entity, TUpdateDto dto);
        protected abstract void ToggleEntityStatus(TEntity entity);
        protected abstract long GetEntityId(TEntity entity);

        // Virtual methods with default implementations
        protected virtual IQueryable<TEntity> ApplySearchFilter(IQueryable<TEntity> query, string? search)
        {
            if (string.IsNullOrWhiteSpace(search))
                return query;

            string normalizedSearch = search.ToLower().Trim();
            return query.Where(e => EF.Property<string>(e, "Title").ToLower().Contains(normalizedSearch));
        }

        protected virtual IQueryable<TEntity> ApplyGenreFilter(IQueryable<TEntity> query, long? genreId)
        {
            if (!genreId.HasValue)
                return query;

            return query.Where(e => EF.Property<long?>(e, "GenreId") == genreId.Value);
        }

        protected virtual IQueryable<TEntity> ApplyCustomFilter(IQueryable<TEntity> query, TFilter? filter)
        {
            // Default implementation does nothing - override in derived classes if needed
            return query;
        }

        protected virtual async Task ValidateCreateDto(TCreateDto dto)
        {
            // Get GenreId using reflection
            var genreIdProp = dto?.GetType().GetProperty("GenreId");
            if (genreIdProp != null)
            {
                var genreId = genreIdProp.GetValue(dto) as long?;
                if (genreId.HasValue)
                {
                    await ValidateGenreAsync(genreId.Value);
                }
            }
        }

        protected virtual async Task ValidateUpdateDto(TUpdateDto dto)
        {
            // Get GenreId using reflection
            var genreIdProp = dto?.GetType().GetProperty("GenreId");
            if (genreIdProp != null)
            {
                var genreId = genreIdProp.GetValue(dto) as long?;
                if (genreId.HasValue)
                {
                    await ValidateGenreAsync(genreId.Value);
                }
            }
        }

        protected virtual void SetCreatedAt(TEntity entity)
        {
            var createdAtProp = entity.GetType().GetProperty("CreatedAt");
            if (createdAtProp != null && createdAtProp.CanWrite)
            {
                createdAtProp.SetValue(entity, DateTime.UtcNow);
            }
        }

        protected async Task ValidateGenreAsync(long genreId)
        {
            bool exists = await Context.Genres.AnyAsync(g => g.Id == genreId);
            if (!exists)
                throw new ArgumentException("Invalid Genre ID");
        }
    }
}
