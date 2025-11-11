using Microsoft.AspNetCore.Mvc;
using MoviesAndStuff.Api.Data.Dtos.Games;
using MoviesAndStuff.Api.Data.Enums;
using MoviesAndStuff.Api.Data.Models;
using MoviesAndStuff.Api.Services.Interfaces;

namespace MoviesAndStuff.Api.Controllers
{
    /// <summary>
    /// Controller for Game operations.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class GamesController : BaseMediaController<
        Game,
        GameListDto,
        GameDetailDto,
        CreateGameDto,
        UpdateGameDto,
        PlayFilter?,
        IGameService>
    {
        public GamesController(IGameService service) : base(service) { }

        [HttpGet]
        [ProducesResponseType(typeof(List<GameListDto>), StatusCodes.Status200OK)]
        public override async Task<ActionResult<List<GameListDto>>> GetAll(
            [FromQuery] string? search = null,
            [FromQuery] long? genreId = null,
            [FromQuery] PlayFilter? filter = null)
        {
            return await base.GetAll(search, genreId, filter);
        }

        [HttpGet("{id:long}")]
        [ProducesResponseType(typeof(GameDetailDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public override async Task<ActionResult<GameDetailDto>> GetById(long id)
        {
            return await base.GetById(id);
        }

        [HttpPost]
        [ProducesResponseType(typeof(GameDetailDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public override async Task<ActionResult<GameDetailDto>> Create([FromBody] CreateGameDto dto)
        {
            return await base.Create(dto);
        }

        [HttpPut("{id:long}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public override async Task<ActionResult> Update(long id, [FromBody] UpdateGameDto dto)
        {
            return await base.Update(id, dto);
        }

        [HttpPatch("{id:long}/played")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> TogglePlayStatus(long id)
        {
            return await ToggleStatus(id);
        }

        [HttpDelete("{id:long}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public override async Task<ActionResult> Delete(long id)
        {
            return await base.Delete(id);
        }

        protected override long GetIdFromDetailDto(GameDetailDto dto) => dto.Id;
        protected override string GetMediaTypeName() => "Game";
    }
}
