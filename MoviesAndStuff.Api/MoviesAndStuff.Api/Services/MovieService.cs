using Microsoft.EntityFrameworkCore;
using MoviesAndStuff.Api.Data;
using MoviesAndStuff.Api.Models;
using MoviesAndStuff.Api.Data.Dtos;

namespace MoviesAndStuff.Api.Services
{
    public class MovieService
    {
        private readonly AppDbContext _context;

        public MovieService(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Gets movie list, and applies filter if applicable.
        /// </summary>
        public async Task<List<MovieListDto>> GetMovieListAsync(string? search)
        {
            IQueryable<Movie>? query = _context.Movies.Include(m => m.Genre).AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                string normalizeSearch = search.ToLower().Trim();

                query = query.Where(m =>
                    m.Title.ToLower().Contains(normalizeSearch)
                );
            }

            return await query
                .Select(m => new MovieListDto
                {
                    Id = m.Id,
                    Title = m.Title,
                    WatchDate = m.WatchDate,
                    IsWatched = m.IsWatched,
                    GenreName = m.Genre != null ? m.Genre.name : null,
                })
                .ToListAsync();
        }

        public async Task<Movie?> GetByIdAsync(long id)
            => await _context.Movies.FirstOrDefaultAsync(m => m.Id == id);

        public async Task<Movie> CreateAsync(Movie movie)
        {
            _context.Movies.Add(movie);
            await _context.SaveChangesAsync();
            return movie;
        }

        public async Task UpdateAsync(Movie movie)
        {
            _context.Movies.Update(movie);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> DeleteAsync(long id)
        {
            Movie? movie = await _context.Movies.FindAsync(id);
            if (movie is null)
                return false;

            _context.Movies.Remove(movie);
            await _context.SaveChangesAsync();
            return true;
        }

        #region Genre

        public async Task<List<Genre>> GetGenresList() => await _context.Genres.ToListAsync();

        #endregion Genre
    }
}
