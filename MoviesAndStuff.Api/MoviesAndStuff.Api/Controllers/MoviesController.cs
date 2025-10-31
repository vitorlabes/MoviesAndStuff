using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MoviesAndStuff.Api.Data.Dtos.Movies;
using MoviesAndStuff.Api.Data.Enums;
using MoviesAndStuff.Api.Services.Interfaces;

namespace MoviesAndStuff.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MoviesController : ControllerBase
    {
        private readonly IMovieService _service;

        public MoviesController(IMovieService service)
        {
            _service = service;
        }

        /// <summary>
        /// Gets movie list, optionally filtered by search term, genre, and watch status
        /// </summary>
        /// <param name="search">Search term that filters by Title</param>
        /// <param name="genreId">Filter by genre ID</param>
        /// <param name="watchFilter">Filter by watch status (All, Watched, Queue)</param>
        [HttpGet]
        public async Task<ActionResult<List<MovieListDto>>> GetAll(
            [FromQuery] string? search = null,
            [FromQuery] long? genreId = null,
            [FromQuery] WatchFilter watchFilter = WatchFilter.All)
        {
            var movies = await _service.GetAllAsync(search, genreId, watchFilter);
            return Ok(movies);
        }

        /// <summary>
        /// Gets a specific movie by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<MovieDetailDto>> GetById(long id)
        {
            MovieDetailDto? movie = await _service.GetByIdAsync(id);
            return movie == null ? NotFound() : Ok(movie);
        }

        /// <summary>
        /// Creates a new movie
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<MovieDetailDto>> Create(CreateMovieDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                MovieDetailDto? created = await _service.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        /// <summary>
        /// Updates an existing movie
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult> Update(long id, UpdateMovieDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                bool updated = await _service.UpdateAsync(id, dto);
                return updated ? NoContent() : NotFound();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (DbUpdateConcurrencyException)
            {
                return NotFound("Movie not found");
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Toggles the watched status of a movie
        /// </summary>
        [HttpPatch("{id}/watched")]
        public async Task<ActionResult> ToggleWatchStatus(long id)
        {
            bool result = await _service.ToggleWatchedAsync(id);
            return result ? NoContent() : NotFound();
        }

        /// <summary>
        /// Deletes a movie
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(long id)
        {
            bool deleted = await _service.DeleteAsync(id);
            return deleted ? NoContent() : NotFound();
        }

    }
}
