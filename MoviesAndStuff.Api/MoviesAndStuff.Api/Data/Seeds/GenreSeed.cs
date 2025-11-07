using MoviesAndStuff.Api.Models;

namespace MoviesAndStuff.Api.Data.Seed
{
    public static class GenreSeed
    {
        public static IEnumerable<Genre> Get() => new List<Genre>
        {
            new Genre { Id = 1, Name = "Action", Order = 1, IsActive = true },
            new Genre { Id = 2, Name = "Adventure", Order = 2, IsActive = true },
            new Genre { Id = 3, Name = "Comedy", Order = 3, IsActive = true },
            new Genre { Id = 4, Name = "Drama", Order = 4, IsActive = true },
            new Genre { Id = 5, Name = "Horror", Order = 5, IsActive = true },
            new Genre { Id = 6, Name = "Romance", Order = 6, IsActive = true },
            new Genre { Id = 7, Name = "Sci-Fi", Order = 7, IsActive = true },
            new Genre { Id = 8, Name = "Thriller", Order = 8, IsActive = true },
            new Genre { Id = 9, Name = "Fantasy", Order = 9, IsActive = true },
            new Genre { Id = 10, Name = "RPG", Order = 10, IsActive = true },
            new Genre { Id = 11, Name = "Strategy", Order = 11, IsActive = true },
            new Genre { Id = 12, Name = "FPS", Order = 12, IsActive = true },
            new Genre { Id = 13, Name = "Platformer", Order = 13, IsActive = true },
            new Genre { Id = 14, Name = "Sports", Order = 14, IsActive = true },
            new Genre { Id = 15, Name = "Racing", Order = 15, IsActive = true },
            new Genre { Id = 16, Name = "Crime", Order = 16, IsActive = true },
            new Genre { Id = 17, Name = "Documentary", Order = 17, IsActive = true }
        };
    }
}
