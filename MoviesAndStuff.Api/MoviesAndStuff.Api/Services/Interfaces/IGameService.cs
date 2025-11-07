using MoviesAndStuff.Api.Data.Dtos.Games;
using MoviesAndStuff.Api.Data.Enums;

namespace MoviesAndStuff.Api.Services.Interfaces
{
    public interface IGameService : IBaseMediaService<GameListDto, GameDetailDto, CreateGameDto, UpdateGameDto, PlayFilter?> {}
}
