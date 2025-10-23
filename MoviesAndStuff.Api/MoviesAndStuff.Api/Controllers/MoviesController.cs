using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MoviesAndStuff.Api.Data.Dtos;
using MoviesAndStuff.Api.Data.Enums;
using MoviesAndStuff.Api.Models;
using MoviesAndStuff.Api.Services;
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

        #region Movies

        /// <summary>
        /// Returns movie list, optionally filtered by search term.
        /// </summary>
        /// <param name="search">Search term(optional) that filters by Title.</param>
        [HttpGet]
        public async Task<ActionResult<List<MovieListDto>>> GetList([FromQuery] string? search, [FromQuery] string? genreId, [FromQuery] WatchFilter watchFilter = WatchFilter.All)
        {
            return Ok(await _service.GetMovieListAsync(search, genreId, watchFilter));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> Get(long id)
        {
            Movie? movie = await _service.GetByIdAsync(id);
            return movie == null ? NotFound() : Ok(movie);
        }

        [HttpPost]
        public async Task<ActionResult> Create(Movie movie)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                Movie? created = await _service.CreateAsync(movie);
                return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
            }
            catch (Exception ex)
            {
                var innerException = ex.InnerException?.Message;
                return BadRequest(innerException ?? ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(long id, Movie movie)
        {
            movie.Id = id;

            try
            {
                await _service.UpdateAsync(movie);
                return NoContent();
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

        [HttpPatch("{id}/watched")]
        public async Task<ActionResult> UpdateWatchStatus(long id)
        {
            var result = await _service.ToggleWatchedAsync(id);

            if (!result)
                return NotFound();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(long id)
        {
            bool deleted = await _service.DeleteAsync(id);
            return deleted ? NoContent() : NotFound();
        }

        #endregion Movies

        #region Genre

        [HttpGet("genres")]
        public async Task<ActionResult> GetGenreList() => Ok(await _service.GetGenresList());

        #endregion Genre

    }
}
