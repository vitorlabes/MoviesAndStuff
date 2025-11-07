using MoviesAndStuff.Api.Data.Models;

namespace MoviesAndStuff.Api.Data.Seed
{
    public static class MediaTypeSeed
    {
        public static IEnumerable<MediaType> Get() => new List<MediaType>
        {
            new MediaType { Id = "MOVIE", Name = "Movie" },
            new MediaType { Id = "GAME", Name = "Game" },
            new MediaType { Id = "SERIES", Name = "Series" }
        };
    }
}
