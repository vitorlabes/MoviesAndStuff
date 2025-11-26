using MoviesAndStuff.Api.Data.Dtos.Movies;
using MoviesAndStuff.Api.Data.Enums;

namespace MoviesAndStuff.Api.Services.Interfaces
{
    public interface IMovieService : IBaseMediaService<MovieListDto, MovieDetailDto, MovieFormDto, WatchFilter?> {}
}
