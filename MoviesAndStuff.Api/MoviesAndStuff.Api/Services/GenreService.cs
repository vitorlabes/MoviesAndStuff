using Microsoft.EntityFrameworkCore;
using MoviesAndStuff.Api.Data;
using MoviesAndStuff.Api.Data.Dtos;
using MoviesAndStuff.Api.Data.Dtos.Genres;
using MoviesAndStuff.Api.Data.Models;
using MoviesAndStuff.Api.Models;
using MoviesAndStuff.Api.Services.Interfaces;

namespace MoviesAndStuff.Api.Services
{
    public class GenreService: IGenreService
    {
        private readonly AppDbContext _context;

        public GenreService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<GenreListDto>> GetAllAsync(string? mediaTypeId = null, bool? isActive = null)
        {
            IQueryable<Genre> query = _context.Genres
                .Include(g => g.GenreMediaTypes)
                    .ThenInclude(gmt => gmt.MediaType)
                .AsQueryable();

            if (isActive.HasValue)
            {
                query = query.Where(g => g.IsActive == isActive.Value);
            }

            if (!string.IsNullOrWhiteSpace(mediaTypeId))
            {
                query = query.Where(g => g.GenreMediaTypes.Any(gmt => gmt.MediaTypeId == mediaTypeId));
            }

            return await query
                .OrderBy(g => g.Order)
                .Select(g => new GenreListDto
                {
                    Id = g.Id,
                    Name = g.Name,
                    Order = g.Order,
                    IsActive = g.IsActive,
                    MediaTypes = g.GenreMediaTypes
                        .Select(gmt => gmt.MediaType.Name)
                        .ToList()
                })
                .ToListAsync();
        }

        public async Task<GenreDetailDto?> GetByIdAsync(long id)
        {
            var genre = await _context.Genres
                .Include(g => g.GenreMediaTypes)
                    .ThenInclude(gmt => gmt.MediaType)
                .FirstOrDefaultAsync(g => g.Id == id);

            if (genre == null)
                return null;

            return new GenreDetailDto
            {
                Id = genre.Id,
                Name = genre.Name,
                Order = genre.Order,
                IsActive = genre.IsActive,
                CreatedAt = genre.CreatedAt,
                UpdatedAt = genre.UpdatedAt,
                MediaTypes = genre.GenreMediaTypes
                    .OrderBy(gmt => gmt.Order)
                    .Select(gmt => new MediaTypeAssociationDto
                    {
                        MediaTypeId = gmt.MediaTypeId,
                        MediaTypeName = gmt.MediaType.Name,
                        Order = gmt.Order
                    })
                    .ToList()
            };
        }

        public async Task<GenreDetailDto> CreateAsync(CreateGenreDto dto)
        {
            List<string>? validMediaTypes = await _context.MediaTypes
                .Where(mt => dto.MediaTypeIds.Contains(mt.Id))
                .Select(mt => mt.Id)
                .ToListAsync();

            if (validMediaTypes.Count != dto.MediaTypeIds.Count)
            {
                throw new ArgumentException("One or more invalid MediaType IDs");
            }

            var genre = new Genre
            {
                Name = dto.Name,
                Order = dto.Order,
                IsActive = dto.IsActive,
                CreatedAt = DateTime.UtcNow
            };

            _context.Genres.Add(genre);
            await _context.SaveChangesAsync();

            // Create associations
            List<GenreMediaType>? associations = dto.MediaTypeIds.Select((mediaTypeId, index) => new GenreMediaType
            {
                GenreId = genre.Id,
                MediaTypeId = mediaTypeId,
                Order = index + 1,
                CreatedAt = DateTime.UtcNow
            }).ToList();

            _context.GenreMediaTypes.AddRange(associations);
            await _context.SaveChangesAsync();

            return (await GetByIdAsync(genre.Id))!;
        }

        public async Task<bool> UpdateAsync(long id, UpdateGenreDto dto)
        {
            Genre? genre = await _context.Genres
                .Include(g => g.GenreMediaTypes)
                .FirstOrDefaultAsync(g => g.Id == id);

            if (genre == null)
                return false;

            List<string>? validMediaTypes = await _context.MediaTypes
                .Where(mt => dto.MediaTypeIds.Contains(mt.Id))
                .Select(mt => mt.Id)
                .ToListAsync();

            if (validMediaTypes.Count != dto.MediaTypeIds.Count)
            {
                throw new ArgumentException("One or more invalid MediaType IDs");
            }

            // Update genre properties
            genre.Name = dto.Name;
            genre.Order = dto.Order;
            genre.IsActive = dto.IsActive;
            genre.UpdatedAt = DateTime.UtcNow;

            // Remove old associations
            _context.GenreMediaTypes.RemoveRange(genre.GenreMediaTypes);

            // Create new associations
            var newAssociations = dto.MediaTypeIds.Select((mediaTypeId, index) => new GenreMediaType
            {
                GenreId = genre.Id,
                MediaTypeId = mediaTypeId,
                Order = index + 1,
                CreatedAt = DateTime.UtcNow
            }).ToList();

            _context.GenreMediaTypes.AddRange(newAssociations);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteAsync(long id)
        {
            Genre? genre = await _context.Genres.FindAsync(id);

            if (genre == null)
                return false;

            _context.Genres.Remove(genre);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> ExistsAsync(long id)
        {
            return await _context.Genres.AnyAsync(g => g.Id == id);
        }
    }
}
