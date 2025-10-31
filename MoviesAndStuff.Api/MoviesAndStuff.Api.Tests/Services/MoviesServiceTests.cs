//using Xunit;
//using FluentAssertions;
//using MoviesAndStuff.Api.Data;
//using MoviesAndStuff.Api.Data.Enums;
//using MoviesAndStuff.Api.Models;
//using MoviesAndStuff.Api.Services;
//using MoviesAndStuff.Api.Tests.Helpers;

//namespace MoviesAndStuff.Api.Tests.Services
//{
//    public class MovieServiceTests : IDisposable
//    {
//        private readonly AppDbContext _context;
//        private readonly MovieService _service;

//        public MovieServiceTests()
//        {
//            _context = MockDbContextFactory.CreateInMemoryContext();
//            _service = new MovieService(_context);
//            SeedDatabase();
//        }

//        private void SeedDatabase()
//        {
//            var genres = new List<Genre>
//            {
//                new Genre { Id = "1", Name = "Action" },
//                new Genre { Id = "2", Name = "Comedy" },
//                new Genre { Id = "3", Name = "Drama" }
//            };

//            var movies = new List<Movie>
//            {
//                new Movie { Id = 1, Title = "Matrix", IsWatched = true, GenreId = "1" },
//                new Movie { Id = 2, Title = "The Hangover", IsWatched = false, GenreId = "2" },
//                new Movie { Id = 3, Title = "Inception", IsWatched = true, GenreId = "1" },
//                new Movie { Id = 4, Title = "Forrest Gump", IsWatched = false, GenreId = "3" }
//            };

//            _context.Genres.AddRange(genres);
//            _context.Movies.AddRange(movies);
//            _context.SaveChanges();
//        }

//        #region GetMovieListAsync Tests

//        [Fact]
//        public async Task GetMovieListAsync_WithoutFilters_ReturnsAllMovies()
//        {
//            // Act
//            var result = await _service.GetMovieListAsync(null, null, WatchFilter.All);

//            // Assert
//            result.Should().HaveCount(4);
//        }

//        [Fact]
//        public async Task GetMovieListAsync_WithSearchTerm_ReturnsFilteredMovies()
//        {
//            // Act
//            var result = await _service.GetMovieListAsync("Matrix", null, WatchFilter.All);

//            // Assert
//            result.Should().HaveCount(1);
//            result.First().Title.Should().Be("Matrix");
//        }

//        [Fact]
//        public async Task GetMovieListAsync_SearchIsCaseInsensitive()
//        {
//            // Act
//            var result = await _service.GetMovieListAsync("MATRIX", null, WatchFilter.All);

//            // Assert
//            result.Should().HaveCount(1);
//            result.First().Title.Should().Be("Matrix");
//        }

//        [Fact]
//        public async Task GetMovieListAsync_WithGenreFilter_ReturnsMoviesOfGenre()
//        {
//            // Act
//            var result = await _service.GetMovieListAsync(null, "1", WatchFilter.All);

//            // Assert
//            result.Should().HaveCount(2);
//            result.Should().OnlyContain(m => m.GenreName == "Action");
//        }

//        [Fact]
//        public async Task GetMovieListAsync_WatchedFilter_ReturnsOnlyWatchedMovies()
//        {
//            // Act
//            var result = await _service.GetMovieListAsync(null, null, WatchFilter.Watched);

//            // Assert
//            result.Should().HaveCount(2);
//            result.Should().OnlyContain(m => m.IsWatched == true);
//        }

//        [Fact]
//        public async Task GetMovieListAsync_QueueFilter_ReturnsOnlyUnwatchedMovies()
//        {
//            // Act
//            var result = await _service.GetMovieListAsync(null, null, WatchFilter.Queue);

//            // Assert
//            result.Should().HaveCount(2);
//            result.Should().OnlyContain(m => m.IsWatched == false);
//        }

//        [Fact]
//        public async Task GetMovieListAsync_CombinedFilters_ReturnsCorrectResults()
//        {
//            // Act
//            var result = await _service.GetMovieListAsync("i", "1", WatchFilter.Watched);

//            // Assert
//            result.Should().HaveCount(2); // Matrix e Inception
//            result.Should().OnlyContain(m => m.IsWatched && m.GenreName == "Action");
//        }

//        #endregion

//        #region GetByIdAsync Tests

//        [Fact]
//        public async Task GetByIdAsync_ExistingId_ReturnsMovie()
//        {
//            // Act
//            var result = await _service.GetByIdAsync(1);

//            // Assert
//            result.Should().NotBeNull();
//            result!.Title.Should().Be("Matrix");
//        }

//        [Fact]
//        public async Task GetByIdAsync_NonExistingId_ReturnsNull()
//        {
//            // Act
//            var result = await _service.GetByIdAsync(999);

//            // Assert
//            result.Should().BeNull();
//        }

//        #endregion

//        #region CreateAsync Tests

//        [Fact]
//        public async Task CreateAsync_ValidMovie_AddsToDatabase()
//        {
//            // Arrange
//            var newMovie = new Movie { Title = "New Movie", IsWatched = false, GenreId = "1" };

//            // Act
//            var result = await _service.CreateAsync(newMovie);

//            // Assert
//            result.Id.Should().BeGreaterThan(0);
//            result.Title.Should().Be("New Movie");

//            var movieInDb = await _service.GetByIdAsync(result.Id);
//            movieInDb.Should().NotBeNull();
//        }

//        #endregion

//        #region UpdateAsync Tests

//        [Fact]
//        public async Task UpdateAsync_ExistingMovie_UpdatesDatabase()
//        {
//            // Arrange
//            var movie = await _service.GetByIdAsync(1);
//            movie!.Title = "Matrix Updated";

//            // Act
//            await _service.UpdateAsync(movie);

//            // Assert
//            var updatedMovie = await _service.GetByIdAsync(1);
//            updatedMovie!.Title.Should().Be("Matrix Updated");
//        }

//        #endregion

//        #region ToggleWatchedAsync Tests

//        [Fact]
//        public async Task ToggleWatchedAsync_ExistingMovie_TogglesStatus()
//        {
//            // Arrange
//            var movie = await _service.GetByIdAsync(1);
//            var originalStatus = movie!.IsWatched;

//            // Act
//            var result = await _service.ToggleWatchedAsync(1);

//            // Assert
//            result.Should().BeTrue();
//            var updatedMovie = await _service.GetByIdAsync(1);
//            updatedMovie!.IsWatched.Should().Be(!originalStatus);
//        }

//        [Fact]
//        public async Task ToggleWatchedAsync_NonExistingMovie_ReturnsFalse()
//        {
//            // Act
//            var result = await _service.ToggleWatchedAsync(999);

//            // Assert
//            result.Should().BeFalse();
//        }

//        #endregion

//        #region DeleteAsync Tests

//        [Fact]
//        public async Task DeleteAsync_ExistingMovie_RemovesFromDatabase()
//        {
//            // Act
//            var result = await _service.DeleteAsync(1);

//            // Assert
//            result.Should().BeTrue();
//            var deletedMovie = await _service.GetByIdAsync(1);
//            deletedMovie.Should().BeNull();
//        }

//        [Fact]
//        public async Task DeleteAsync_NonExistingMovie_ReturnsFalse()
//        {
//            // Act
//            var result = await _service.DeleteAsync(999);

//            // Assert
//            result.Should().BeFalse();
//        }

//        #endregion

//        #region GetGenresList Tests

//        [Fact]
//        public async Task GetGenresList_ReturnsAllGenres()
//        {
//            // Act
//            var result = await _service.GetGenresList();

//            // Assert
//            result.Should().HaveCount(3);
//            result.Should().Contain(g => g.Name == "Action");
//            result.Should().Contain(g => g.Name == "Comedy");
//            result.Should().Contain(g => g.Name == "Drama");
//        }

//        #endregion

//        public void Dispose()
//        {
//            _context.Database.EnsureDeleted();
//            _context.Dispose();
//        }
//    }
//}