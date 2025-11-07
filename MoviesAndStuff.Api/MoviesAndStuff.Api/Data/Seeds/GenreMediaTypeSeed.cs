using MoviesAndStuff.Api.Data.Models;

namespace MoviesAndStuff.Api.Data.Seed
{
    public static class GenreMediaTypeSeed
    {
        public static IEnumerable<GenreMediaType> Get() => new List<GenreMediaType>
        {
            new GenreMediaType { Id = 1, GenreId = 1, MediaTypeId = "MOVIE", Order = 1 },
            new GenreMediaType { Id = 2, GenreId = 2, MediaTypeId = "MOVIE", Order = 2 },
            new GenreMediaType { Id = 3, GenreId = 3, MediaTypeId = "MOVIE", Order = 3 },
            new GenreMediaType { Id = 4, GenreId = 4, MediaTypeId = "MOVIE", Order = 4 },
            new GenreMediaType { Id = 5, GenreId = 5, MediaTypeId = "MOVIE", Order = 5 },
            new GenreMediaType { Id = 6, GenreId = 6, MediaTypeId = "MOVIE", Order = 6 },
            new GenreMediaType { Id = 7, GenreId = 7, MediaTypeId = "MOVIE", Order = 7 },
            new GenreMediaType { Id = 8, GenreId = 8, MediaTypeId = "MOVIE", Order = 8 },
            new GenreMediaType { Id = 9, GenreId = 9, MediaTypeId = "MOVIE", Order = 9 },

            new GenreMediaType { Id = 10, GenreId = 1, MediaTypeId = "GAME", Order = 1 },
            new GenreMediaType { Id = 11, GenreId = 2, MediaTypeId = "GAME", Order = 2 },
            new GenreMediaType { Id = 12, GenreId = 10, MediaTypeId = "GAME", Order = 3 },
            new GenreMediaType { Id = 13, GenreId = 11, MediaTypeId = "GAME", Order = 4 },
            new GenreMediaType { Id = 14, GenreId = 12, MediaTypeId = "GAME", Order = 5 },
            new GenreMediaType { Id = 15, GenreId = 13, MediaTypeId = "GAME", Order = 6 },
            new GenreMediaType { Id = 16, GenreId = 14, MediaTypeId = "GAME", Order = 7 },
            new GenreMediaType { Id = 17, GenreId = 15, MediaTypeId = "GAME", Order = 8 }
        };
    }
}
