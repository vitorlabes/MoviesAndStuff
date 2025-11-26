using Microsoft.AspNetCore.Mvc;
using MoviesAndStuff.Api.Data.Dtos;
using MoviesAndStuff.Api.Data.Dtos.Genres;
using MoviesAndStuff.Api.Services.Interfaces;

namespace MoviesAndStuff.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GenresController : ControllerBase
    {
        private readonly IGenreService _service;

        public GenresController(IGenreService service)
        {
            _service = service;
        }

        /// <summary>
        /// Gets all genres, optionally filtered by media type and active status
        /// </summary>
        /// <param name="mediaTypeId">Filter by media type ID</param>
        /// <param name="isActive">Filter by active status</param>
        [HttpGet]
        public async Task<ActionResult<List<GenreListDto>>> GetAll(
            [FromQuery] string? mediaTypeId = null,
            [FromQuery] bool? isActive = null)
        {
            List<GenreListDto> genres = await _service.GetAllAsync(mediaTypeId, isActive);
            return Ok(genres);
        }

        /// <summary>
        /// Gets a specific genre by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<GenreDetailDto>> GetById(long id)
        {
            GenreDetailDto? genre = await _service.GetByIdAsync(id);
            return genre == null ? NotFound() : Ok(genre);
        }

        /// <summary>
        /// Creates a new genre
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<GenreDetailDto>> Create(GenreFormDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                GenreDetailDto? created = await _service.CreateAsync(dto);
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
        /// Updates an existing genre
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult> Update(long id, GenreFormDto dto)
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
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        /// <summary>
        /// Deletes a genre
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(long id)
        {
            bool deleted = await _service.DeleteAsync(id);
            return deleted ? NoContent() : NotFound();
        }
        
        /// <summary>
        /// Gets all media types
        /// </summary>
        [HttpGet("mediaTypes")]
        public async Task<ActionResult> GetAllMediaTypes()
        {
            List<MediaTypeListDto> mediaTypes = await _service.GetAllMediaTypes();
            return Ok(mediaTypes);
        }

    }
}
