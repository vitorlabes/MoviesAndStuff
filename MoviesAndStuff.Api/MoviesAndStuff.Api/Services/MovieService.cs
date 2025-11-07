using Microsoft.EntityFrameworkCore;
using MoviesAndStuff.Api.Data;
using MoviesAndStuff.Api.Data.Dtos.Movies;
using MoviesAndStuff.Api.Data.Enums;
using MoviesAndStuff.Api.Models;
using MoviesAndStuff.Api.Services.Interfaces;
using System.Linq.Expressions;

namespace MoviesAndStuff.Api.Services
{
    public class MovieService : BaseMediaService<Movie, MovieListDto, MovieDetailDto, CreateMovieDto, UpdateMovieDto, WatchFilter?>, IMovieService
    {
        public MovieService(AppDbContext context) : base(context) {}

        protected override IQueryable<Movie> GetBaseQuery()
        {
            return Context.Movies.Include(m => m.Genre);
        }

        protected override IQueryable<Movie> GetDetailQuery()
        {
            return Context.Movies.Include(m => m.Genre);
        }

        protected override Expression<Func<Movie, MovieListDto>> MapToListDto()
        {
            return m => new MovieListDto
            {
                Id = m.Id,
                Title = m.Title,
                WatchDate = m.WatchDate,
                IsWatched = m.IsWatched,
                GenreName = m.Genre != null ? m.Genre.Name : null
            };
        }

        protected override MovieDetailDto MapToDetailDto(Movie movie)
        {
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

        protected override Movie MapToEntity(CreateMovieDto dto)
        {
            return new Movie
            {
                Title = dto.Title,
                Review = dto.Review,
                Director = dto.Director,
                GenreId = dto.GenreId,
                Duration = dto.Duration,
                Rating = dto.Rating,
                PremiereDate = dto.PremiereDate,
                WatchDate = dto.WatchDate,
                IsWatched = dto.IsWatched
            };
        }

        protected override void UpdateEntityFromDto(Movie movie, UpdateMovieDto dto)
        {
            movie.Title = dto.Title;
            movie.Review = dto.Review;
            movie.Director = dto.Director;
            movie.GenreId = dto.GenreId;
            movie.Duration = dto.Duration;
            movie.Rating = dto.Rating;
            movie.PremiereDate = dto.PremiereDate;
            movie.WatchDate = dto.WatchDate;
            movie.IsWatched = dto.IsWatched;
        }

        protected override void ToggleEntityStatus(Movie movie)
        {
            movie.IsWatched = !movie.IsWatched;

            if (movie.IsWatched && !movie.WatchDate.HasValue)
            {
                movie.WatchDate = DateTime.UtcNow;
            }
        }

        protected override long GetEntityId(Movie movie)
        {
            return movie.Id;
        }
    }
}
