using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MoviesAndStuff.Api.Services.Interfaces;

namespace MoviesAndStuff.Api.Controllers
{
    /// <summary>
    /// Base controller for media entities (Movies, Games)
    /// Provides common CRUD operations with configurable behavior
    /// </summary>
    /// <typeparam name="TEntity">The entity type (Movie, Game)</typeparam>
    /// <typeparam name="TListDto">DTO for list operations</typeparam>
    /// <typeparam name="TDetailDto">DTO for detail operations</typeparam>
    /// <typeparam name="TCreateDto">DTO for create operations</typeparam>
    /// <typeparam name="TUpdateDto">DTO for update operations</typeparam>
    /// <typeparam name="TFilter">Filter enum type (WatchFilter, PlayFilter)</typeparam>
    /// <typeparam name="TService">Service interface type</typeparam>
    [ApiController]
    [Route("api/[controller]")]
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
        /// Gets media list, optionally filtered by search term, genre, and custom filter
        /// </summary>
        /// <param name="search">Search term that filters by Title</param>
        /// <param name="genreId">Filter by genre ID</param>
        /// <param name="filter">Custom filter (watch status, play status, etc.)</param>
        [HttpGet]
        public virtual async Task<ActionResult<List<TListDto>>> GetAll(
            [FromQuery] string? search = null,
            [FromQuery] long? genreId = null,
            [FromQuery] TFilter? filter = default)
        {
            var items = await Service.GetAllAsync(search, genreId, filter);
            return Ok(items);
        }

        /// <summary>
        /// Gets a specific media item by ID
        /// </summary>
        [HttpGet("{id}")]
        public virtual async Task<ActionResult<TDetailDto>> GetById(long id)
        {
            TDetailDto? item = await Service.GetByIdAsync(id);
            return item == null ? NotFound() : Ok(item);
        }

        /// <summary>
        /// Creates a new media item
        /// </summary>
        [HttpPost]
        public virtual async Task<ActionResult<TDetailDto>> Create(TCreateDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                TDetailDto created = await Service.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = GetIdFromDetailDto(created) }, created);
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
        /// Updates an existing media item
        /// </summary>
        [HttpPut("{id}")]
        public virtual async Task<ActionResult> Update(long id, TUpdateDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                bool updated = await Service.UpdateAsync(id, dto);
                return updated ? NoContent() : NotFound();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (DbUpdateConcurrencyException)
            {
                return NotFound($"{GetMediaTypeName()} not found");
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Toggles the status of a media item (watched/played)
        /// </summary>
        [HttpPatch("{id}/status")]
        public virtual async Task<ActionResult> ToggleStatus(long id)
        {
            bool result = await Service.ToggleStatusAsync(id);
            return result ? NoContent() : NotFound();
        }

        /// <summary>
        /// Deletes a media item
        /// </summary>
        [HttpDelete("{id}")]
        public virtual async Task<ActionResult> Delete(long id)
        {
            bool deleted = await Service.DeleteAsync(id);
            return deleted ? NoContent() : NotFound();
        }

        /// <summary>
        /// Override this to extract the ID from the detail DTO
        /// </summary>
        protected abstract long GetIdFromDetailDto(TDetailDto dto);

        /// <summary>
        /// Override this to provide the media type name for error messages
        /// </summary>
        protected abstract string GetMediaTypeName();
    }
}

