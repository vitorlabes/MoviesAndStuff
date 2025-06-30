using Microsoft.AspNetCore.Mvc;
using MoviesAndStuff.Api.Data.Dtos;
using MoviesAndStuff.Api.Models;
using MoviesAndStuff.Api.Services;

namespace MoviesAndStuff.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MoviesController : ControllerBase
    {
        private readonly MovieService _service;

        public MoviesController(MovieService service)
        {
            _service = service;
        }

        #region Movies

        [HttpGet]
        public async Task<ActionResult<List<MovieListDto>>> GetList()
        {
           return Ok(await _service.GetMovieListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> Get(int id)
        {
            var movie = await _service.GetByIdAsync(id);
            return movie == null ? NotFound() : Ok(movie);
        }

        [HttpPost]
        public async Task<ActionResult> Create(Movie movie)
        {

            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var created = await _service.CreateAsync(movie);
                return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
            }
            catch (Exception ex)
            {
                var innerException = ex.InnerException?.Message;
                return BadRequest(innerException ?? ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, Movie movie)
        {
            if (id != movie.Id) return BadRequest();
            await _service.UpdateAsync(movie);
            return NoContent();
        }

        #endregion Movies

        #region Genre

        [HttpGet("genres")]
        public async Task<ActionResult> GetGenreList() => Ok(await _service.GetGenresList());

        #endregion Genre

    }
}
