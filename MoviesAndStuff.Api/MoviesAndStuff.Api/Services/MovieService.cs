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

        //public async Task<List<Movie>> GetMovieListAsync() => await _context.Movies.ToListAsync();

        public async Task<List<MovieListDto>> GetMovieListAsync()
        {
            return await _context.Movies
                .Include(m => m.Genre)
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

        public async Task<Movie?> GetByIdAsync(int id)
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

        public async Task DeleteAsync(int id)
        {
            var movie = await _context.Movies.FindAsync(id);
            if (movie != null)
            {
                _context.Movies.Remove(movie);
                await _context.SaveChangesAsync();
            }
        }

        #region Genre

        public async Task<List<Genre>> GetGenresList() => await _context.Genres.ToListAsync();

        #endregion Genre
    }
}
