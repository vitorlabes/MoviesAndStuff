using Microsoft.AspNetCore.Mvc;
using MoviesAndStuff.Api.Data.Dtos.Movies;
using MoviesAndStuff.Api.Data.Enums;
using MoviesAndStuff.Api.Models;
using MoviesAndStuff.Api.Services.Interfaces;

namespace MoviesAndStuff.Api.Controllers
{
    /// <summary>
    /// Controller for Movie operations
    /// Inherits common CRUD operations from BaseMediaController
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class MoviesController : BaseMediaController<
        Movie,
        MovieListDto,
        MovieDetailDto,
        CreateMovieDto,
        UpdateMovieDto,
        WatchFilter,
        IMovieService>
    {
        public MoviesController(IMovieService service) : base(service) {}

        /// <summary>
        /// Custom route for toggling watched status
        /// </summary>
        [HttpPatch("{id}/watched")]
        public async Task<ActionResult> ToggleWatchStatus(long id)
        {
            return await ToggleStatus(id);
        }

        protected override long GetIdFromDetailDto(MovieDetailDto dto)
        {
            return dto.Id;
        }

        protected override string GetMediaTypeName()
        {
            return "Movie";
        }
    }
}
