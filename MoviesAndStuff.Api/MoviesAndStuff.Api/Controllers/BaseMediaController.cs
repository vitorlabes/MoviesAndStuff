using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MoviesAndStuff.Api.Services.Interfaces;

namespace MoviesAndStuff.Api.Controllers
{
    /// <summary>
    /// Abstract base for CRUD operations across multiple media entities (movies, games, etc.).
    /// This approach promotes code reuse and enforces consistent REST behavior.
    /// Derived controllers only need to implement entity-specific mappings.
    /// </summary>
    /// <typeparam name="TEntity">Entity type (Movie, Game)</typeparam>
    /// <typeparam name="TListDto">DTO for list operations</typeparam>
    /// <typeparam name="TDetailDto">DTO for detail operations</typeparam>
    /// <typeparam name="TCreateDto">DTO for create operations</typeparam>
    /// <typeparam name="TUpdateDto">DTO for update operations</typeparam>
    /// <typeparam name="TFilter">Filter enum type (WatchFilter, PlayFilter)</typeparam>
    /// <typeparam name="TService">Service interface type</typeparam>
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public abstract class BaseMediaController<TEntity, TListDto, TDetailDto, TCreateDto, TUpdateDto, TFilter, TService> : ControllerBase
        where TEntity : class
        where TService : IBaseMediaService<TListDto, TDetailDto, TCreateDto, TUpdateDto, TFilter>
    {
        protected readonly TService Service;

        protected BaseMediaController(TService service)
        {
            Service = service;
        }

        /// <summary>
        /// Retrieves a list of media items with optional filters.
        /// </summary>
        /// <param name="search">Filter by title or name.</param>
        /// <param name="genreId">Filter by genre ID.</param>
        /// <param name="filter">Custom enum filter (watched/played/etc.).</param>
        /// <returns>List of matching media items.</returns>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public virtual async Task<ActionResult<List<TListDto>>> GetAll(
            [FromQuery] string? search = null,
            [FromQuery] long? genreId = null,
            [FromQuery] TFilter? filter = default)
        {
            var items = await Service.GetAllAsync(search, genreId, filter);
            return Ok(items);
        }

        /// <summary>
        /// Retrieves detailed information about a specific media item.
        /// </summary>
        /// <param name="id">Media item ID.</param>
        [HttpGet("{id:long}")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public virtual async Task<ActionResult<TDetailDto>> GetById(long id)
        {
            var item = await Service.GetByIdAsync(id);
            return item == null ? NotFound() : Ok(item);
        }

        /// <summary>
        /// Creates a new media item.
        /// </summary>
        /// <param name="dto">Data for the new item.</param>
        [HttpPost]
        public virtual async Task<ActionResult<TDetailDto>> Create([FromBody] TCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var created = await Service.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById),
                    new { id = GetIdFromDetailDto(created) }, created);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        /// <summary>
        /// Updates an existing media item.
        /// </summary>
        /// <param name="id">Item ID.</param>
        /// <param name="dto">Updated data.</param>
        [HttpPut("{id:long}")]
        public virtual async Task<ActionResult> Update(long id, [FromBody] TUpdateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var updated = await Service.UpdateAsync(id, dto);
                return updated ? NoContent() : NotFound();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (DbUpdateConcurrencyException)
            {
                return NotFound($"{GetMediaTypeName()} not found.");
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Toggles the watched/played status of a media item.
        /// </summary>
        /// <param name="id">Item ID.</param>
        [HttpPatch("{id:long}/status")]
        public virtual async Task<ActionResult> ToggleStatus(long id)
        {
            var result = await Service.ToggleStatusAsync(id);
            return result ? NoContent() : NotFound();
        }

        /// <summary>
        /// Deletes a media item.
        /// </summary>
        /// <param name="id">Item ID.</param>
        [HttpDelete("{id:long}")]
        public virtual async Task<ActionResult> Delete(long id)
        {
            var deleted = await Service.DeleteAsync(id);
            return deleted ? NoContent() : NotFound();
        }

        /// <summary>
        /// Extracts ID from the detail DTO.
        /// </summary>
        protected abstract long GetIdFromDetailDto(TDetailDto dto);

        /// <summary>
        /// Provides the media type name for error messages.
        /// </summary>
        protected abstract string GetMediaTypeName();
    }
}
