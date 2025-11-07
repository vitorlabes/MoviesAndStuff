using Microsoft.EntityFrameworkCore;
using MoviesAndStuff.Api.Data;
using MoviesAndStuff.Api.Data.Dtos.Games;
using MoviesAndStuff.Api.Data.Enums;
using MoviesAndStuff.Api.Data.Models;
using MoviesAndStuff.Api.Services.Interfaces;
using System.Linq.Expressions;

namespace MoviesAndStuff.Api.Services
{
    public class GameService : BaseMediaService<Game, GameListDto, GameDetailDto, CreateGameDto, UpdateGameDto, PlayFilter?>, IGameService
    {
        public GameService(AppDbContext context) : base(context) {}

        protected override IQueryable<Game> GetBaseQuery()
        {
            return Context.Games.Include(g => g.Genre);
        }

        protected override IQueryable<Game> GetDetailQuery()
        {
            return Context.Games.Include(g => g.Genre);
        }

        protected override Expression<Func<Game, GameListDto>> MapToListDto()
        {
            return g => new GameListDto
            {
                Id = g.Id,
                Title = g.Title,
                PlayDate = g.PlayDate,
                IsPlayed = g.IsPlayed,
                GenreName = g.Genre != null ? g.Genre.Name : null
            };
        }

        protected override GameDetailDto MapToDetailDto(Game game)
        {
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

        protected override Game MapToEntity(CreateGameDto dto)
        {
            return new Game
            {
                Title = dto.Title,
                Review = dto.Review,
                Developer = dto.Developer,
                GenreId = dto.GenreId,
                Rating = dto.Rating,
                ReleaseDate = dto.ReleaseDate,
                PlayDate = dto.PlayDate,
                IsPlayed = dto.IsPlayed
            };
        }

        protected override void UpdateEntityFromDto(Game game, UpdateGameDto dto)
        {
            game.Title = dto.Title;
            game.Review = dto.Review;
            game.Developer = dto.Developer;
            game.GenreId = dto.GenreId;
            game.Rating = dto.Rating;
            game.ReleaseDate = dto.ReleaseDate;
            game.PlayDate = dto.PlayDate;
            game.IsPlayed = dto.IsPlayed;
        }

        protected override void ToggleEntityStatus(Game game)
        {
            game.IsPlayed = !game.IsPlayed;

            if (game.IsPlayed && !game.PlayDate.HasValue)
            {
                game.PlayDate = DateTime.UtcNow;
            }
        }

        protected override long GetEntityId(Game game)
        {
            return game.Id;
        }
    }
}
