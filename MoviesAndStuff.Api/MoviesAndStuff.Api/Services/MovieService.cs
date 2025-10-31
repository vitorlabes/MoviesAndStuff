using Microsoft.EntityFrameworkCore;
using MoviesAndStuff.Api.Data;
using MoviesAndStuff.Api.Models;
using MoviesAndStuff.Api.Data.Enums;
using MoviesAndStuff.Api.Services.Interfaces;
using MoviesAndStuff.Api.Data.Dtos.Movies;

namespace MoviesAndStuff.Api.Services
{
    public class MovieService : IMovieService
    {
        private readonly AppDbContext _context;

        public MovieService(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Gets movie list, and applies filter if applicable.
        /// </summary>
        public async Task<List<MovieListDto>> GetAllAsync(string? search, long? genreId, WatchFilter watchFilter)
        {
            var query = _context.Movies
                .Include(m => m.Genre)
                .AsQueryable();

            query = ApplyFilters(query, search, genreId, watchFilter);

            return await query
                .Select(m => new MovieListDto
                {
                    Id = m.Id,
                    Title = m.Title,
                    WatchDate = m.WatchDate,
                    IsWatched = m.IsWatched,
                    GenreName = m.Genre != null ? m.Genre.Name : null
                })
                .ToListAsync();
        }

        private static IQueryable<Movie> ApplyFilters(IQueryable<Movie> query, string? search, long? genreId, WatchFilter watchFilter)
        {
            if (!string.IsNullOrWhiteSpace(search))
            {
                string normalizedSearch = search.ToLower().Trim();
                query = query.Where(m => m.Title.ToLower().Contains(normalizedSearch));
            }

            if (genreId.HasValue)
            {
                query = query.Where(m => m.GenreId == genreId.Value);
            }

            query = watchFilter switch
            {
                WatchFilter.Watched => query.Where(m => m.IsWatched),
                WatchFilter.Queue => query.Where(m => !m.IsWatched),
                _ => query
            };

            return query;
        }

        public async Task<MovieDetailDto?> GetByIdAsync(long id)
        {
            Movie? movie = await _context.Movies
                .Include(m => m.Genre)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (movie == null)
                return null;

            return new MovieDetailDto
            {
                Id = movie.Id,
                Title = movie.Title,
                Review = movie.Review,
                Director = movie.Director,
                GenreId = movie.GenreId,
                GenreName = movie.Genre?.Name,
                Duration = movie.Duration,
                Rating = movie.Rating,
                PremiereDate = movie.PremiereDate,
                WatchDate = movie.WatchDate,
                IsWatched = movie.IsWatched
            };
        }

        public async Task<MovieDetailDto> CreateAsync(CreateMovieDto dto)
        {
            if (dto.GenreId.HasValue)
            {
                bool genreExists = await _context.Genres.AnyAsync(g => g.Id == dto.GenreId.Value);
                if (!genreExists)
                {
                    throw new ArgumentException("Invalid Genre ID");
                }
            }

            var movie = new Movie
            {
                Title = dto.Title,
                Review = dto.Review,
                Director = dto.Director,
                GenreId = dto.GenreId,
                Duration = dto.Duration,
                Rating = dto.Rating,
                PremiereDate = dto.PremiereDate,
                WatchDate = dto.WatchDate,
                IsWatched = dto.IsWatched,
                CreatedAt = DateTime.UtcNow
            };

            _context.Movies.Add(movie);
            await _context.SaveChangesAsync();

            return (await GetByIdAsync(movie.Id))!;
        }

        public async Task<bool> UpdateAsync(long id, UpdateMovieDto dto)
        {
            Movie? movie = await _context.Movies.FindAsync(id);

            if (movie == null)
                return false;

            if (dto.GenreId.HasValue)
            {
                bool genreExists = await _context.Genres.AnyAsync(g => g.Id == dto.GenreId.Value);
                if (!genreExists)
                {
                    throw new ArgumentException("Invalid Genre ID");
                }
            }

            movie.Title = dto.Title;
            movie.Review = dto.Review;
            movie.Director = dto.Director;
            movie.GenreId = dto.GenreId;
            movie.Duration = dto.Duration;
            movie.Rating = dto.Rating;
            movie.PremiereDate = dto.PremiereDate;
            movie.WatchDate = dto.WatchDate;
            movie.IsWatched = dto.IsWatched;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ToggleWatchedAsync(long id)
        {
            Movie? movie = await _context.Movies.FindAsync(id);

            if (movie == null)
                return false;

            movie.IsWatched = !movie.IsWatched;

            if (movie.IsWatched && !movie.WatchDate.HasValue)
            {
                movie.WatchDate = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(long id)
        {
            var movie = await _context.Movies.FindAsync(id);

            if (movie == null)
                return false;

            _context.Movies.Remove(movie);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
