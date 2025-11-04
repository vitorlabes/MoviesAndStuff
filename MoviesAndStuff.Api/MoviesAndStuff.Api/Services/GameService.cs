using Microsoft.EntityFrameworkCore;
using MoviesAndStuff.Api.Data;
using MoviesAndStuff.Api.Services.Interfaces;
using MoviesAndStuff.Api.Data.Models;
using MoviesAndStuff.Api.Data.Dtos.Games;

namespace MoviesAndStuff.Api.Services
{
    public class GameService : IGameService
    {
        private readonly AppDbContext _context;

        public GameService(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Gets game list, and applies filter if applicable.
        /// </summary>
        public async Task<List<GameListDto>> GetAllAsync(string? search, long? genreId)
        {         
            var query = _context.Games
                .Include(m => m.Genre)
                .AsQueryable();

            query = ApplyFilters(query, search, genreId);

            return await query
                .Select(m => new GameListDto
                {
                    Id = m.Id,
                    Title = m.Title,
                    PlayDate = m.PlayDate,
                    IsPlayed = m.IsPlayed,
                    GenreName = m.Genre != null ? m.Genre.Name : null
                })
                .ToListAsync();
        }

        private static IQueryable<Game> ApplyFilters(IQueryable<Game> query, string? search, long? genreId)
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

            return query;
        }

        public async Task<GameDetailDto?> GetByIdAsync(long id)
        {
            Game? game = await _context.Games
                .Include(m => m.Genre)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (game == null)
                return null;

            return new GameDetailDto
            {
                Id = game.Id,
                Title = game.Title,
                Review = game.Review,
                Developer = game.Developer,
                GenreId = game.GenreId,
                GenreName = game.Genre?.Name,
                Rating = game.Rating,
                ReleaseDate = game.ReleaseDate,
                PlayDate = game.PlayDate,
                IsPlayed = game.IsPlayed
            };
        }

        public async Task<GameDetailDto> CreateAsync(CreateGameDto dto)
        {
            if (dto.GenreId.HasValue)
            {
                bool genreExists = await _context.Genres.AnyAsync(g => g.Id == dto.GenreId.Value);
                if (!genreExists)
                {
                    throw new ArgumentException("Invalid Genre ID");
                }
            }

            var game = new Game
            {
                Title = dto.Title,
                Review = dto.Review,
                Developer = dto.Developer,
                GenreId = dto.GenreId,
                Rating = dto.Rating,
                ReleaseDate = dto.ReleaseDate,
                PlayDate = dto.PlayDate,
                IsPlayed = dto.IsPlayed,
                CreatedAt = DateTime.UtcNow
            };

            _context.Games.Add(game);
            await _context.SaveChangesAsync();

            return (await GetByIdAsync(game.Id))!;
        }

        public async Task<bool> UpdateAsync(long id, UpdateGameDto dto)
        {
            Game? game = await _context.Games.FindAsync(id);

            if (game == null)
                return false;

            if (dto.GenreId.HasValue)
            {
                bool genreExists = await _context.Genres.AnyAsync(g => g.Id == dto.GenreId.Value);
                if (!genreExists)
                {
                    throw new ArgumentException("Invalid Genre ID");
                }
            }

            game.Title = dto.Title;
            game.Review = dto.Review;
            game.Developer = dto.Developer;
            game.GenreId = dto.GenreId;
            game.Rating = dto.Rating;
            game.ReleaseDate = dto.ReleaseDate;
            game.PlayDate = dto.PlayDate;
            game.IsPlayed = dto.IsPlayed;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> TogglePlayedAsync(long id)
        {
            Game? game = await _context.Games.FindAsync(id);

            if (game == null)
                return false;

            game.IsPlayed = !game.IsPlayed;

            if (game.IsPlayed && !game.PlayDate.HasValue)
            {
                game.PlayDate = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(long id)
        {
            var game = await _context.Games.FindAsync(id);

            if (game == null)
                return false;

            _context.Games.Remove(game);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
