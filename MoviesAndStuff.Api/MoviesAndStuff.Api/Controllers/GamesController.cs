using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MoviesAndStuff.Api.Data.Dtos.Games;
using MoviesAndStuff.Api.Services.Interfaces;

namespace MoviesAndStuff.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GamesController : ControllerBase
    {
        private readonly IGameService _service;

        public GamesController(IGameService service)
        {
            _service = service;
        }

        /// <summary>
        /// Gets game list, optionally filtered by search term, genre
        /// </summary>
        /// <param name="search">Search term that filters by Title</param>
        /// <param name="genreId">Filter by genre ID</param>
        [HttpGet]
        public async Task<ActionResult<List<GameListDto>>> GetAll(
            [FromQuery] string? search = null,
            [FromQuery] long? genreId = null)
        {
            var movies = await _service.GetAllAsync(search, genreId);
            return Ok(movies);
        }

        /// <summary>
        /// Gets a specific game by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<GameDetailDto>> GetById(long id)
        {
            GameDetailDto? game = await _service.GetByIdAsync(id);
            return game == null ? NotFound() : Ok(game);
        }

        /// <summary>
        /// Creates a new game
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<GameDetailDto>> Create(CreateGameDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                GameDetailDto? created = await _service.CreateAsync(dto);
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
        /// Updates an existing game
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult> Update(long id, UpdateGameDto dto)
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
        /// Toggles the played status of a game
        /// </summary>
        [HttpPatch("{id}/played")]
        public async Task<ActionResult> TogglePlayStatus(long id)
        {
            bool result = await _service.TogglePlayedAsync(id);
            return result ? NoContent() : NotFound();
        }

        /// <summary>
        /// Deletes a game
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(long id)
        {
            bool deleted = await _service.DeleteAsync(id);
            return deleted ? NoContent() : NotFound();
        }

    }
}
