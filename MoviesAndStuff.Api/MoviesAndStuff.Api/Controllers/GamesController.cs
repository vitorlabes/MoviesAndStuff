using Microsoft.AspNetCore.Mvc;
using MoviesAndStuff.Api.Data.Dtos.Games;
using MoviesAndStuff.Api.Data.Enums;
using MoviesAndStuff.Api.Data.Models;
using MoviesAndStuff.Api.Services.Interfaces;

namespace MoviesAndStuff.Api.Controllers
{
    /// <summary>
    /// Controller for Game operations
    /// Inherits common CRUD operations from BaseMediaController
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class GamesController : BaseMediaController<
        Game,
        GameListDto,
        GameDetailDto,
        CreateGameDto,
        UpdateGameDto,
        PlayFilter?,
        IGameService>
    {
        public GamesController(IGameService service) : base(service) {}

        /// <summary>
        /// Override GetAll to handle optional PlayFilter
        /// </summary>
        [HttpGet]
        public override async Task<ActionResult<List<GameListDto>>> GetAll(
            [FromQuery] string? search = null,
            [FromQuery] long? genreId = null,
            [FromQuery] PlayFilter? filter = null)
        {
            return await base.GetAll(search, genreId, filter);
        }

        /// <summary>
        /// Custom route for toggling played status
        /// </summary>
        [HttpPatch("{id}/played")]
        public async Task<ActionResult> TogglePlayStatus(long id)
        {
            return await ToggleStatus(id);
        }

        protected override long GetIdFromDetailDto(GameDetailDto dto)
        {
            return dto.Id;
        }

        protected override string GetMediaTypeName()
        {
            return "Game";
        }
    }
}
