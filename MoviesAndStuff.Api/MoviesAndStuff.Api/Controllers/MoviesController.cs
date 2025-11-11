using Microsoft.AspNetCore.Mvc;
using MoviesAndStuff.Api.Data.Dtos.Movies;
using MoviesAndStuff.Api.Data.Enums;
using MoviesAndStuff.Api.Models;
using MoviesAndStuff.Api.Services.Interfaces;

namespace MoviesAndStuff.Api.Controllers
{
    /// <summary>
    /// Controller for Movie operations.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class MoviesController : BaseMediaController<
        Movie,
        MovieListDto,
        MovieDetailDto,
        CreateMovieDto,
        UpdateMovieDto,
        WatchFilter?,
        IMovieService>
    {
        public MoviesController(IMovieService service) : base(service) { }

        /// <summary>
        /// Gets all movies with optional filters.
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(List<MovieListDto>), StatusCodes.Status200OK)]
        public override async Task<ActionResult<List<MovieListDto>>> GetAll(
            [FromQuery] string? search = null,
            [FromQuery] long? genreId = null,
            [FromQuery] WatchFilter? filter = null)
        {
            return await base.GetAll(search, genreId, filter);
        }

        /// <summary>
        /// Gets a movie by ID.
        /// </summary>
        [HttpGet("{id:long}")]
        [ProducesResponseType(typeof(MovieDetailDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public override async Task<ActionResult<MovieDetailDto>> GetById(long id)
        {
            return await base.GetById(id);
        }

        /// <summary>
        /// Creates a new movie.
        /// </summary>
        [HttpPost]
        [ProducesResponseType(typeof(MovieDetailDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public override async Task<ActionResult<MovieDetailDto>> Create([FromBody] CreateMovieDto dto)
        {
            return await base.Create(dto);
        }

        /// <summary>
        /// Updates an existing movie.
        /// </summary>
        [HttpPut("{id:long}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public override async Task<ActionResult> Update(long id, [FromBody] UpdateMovieDto dto)
        {
            return await base.Update(id, dto);
        }

        /// <summary>
        /// Toggles the "watched" status of a movie.
        /// </summary>
        [HttpPatch("{id:long}/watched")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> ToggleWatchStatus(long id)
        {
            return await ToggleStatus(id);
        }

        /// <summary>
        /// Deletes a movie.
        /// </summary>
        [HttpDelete("{id:long}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public override async Task<ActionResult> Delete(long id)
        {
            return await base.Delete(id);
        }

        protected override long GetIdFromDetailDto(MovieDetailDto dto) => dto.Id;
        protected override string GetMediaTypeName() => "Movie";
    }
}
