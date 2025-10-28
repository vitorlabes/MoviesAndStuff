using Xunit;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using MoviesAndStuff.Api.Controllers;
using MoviesAndStuff.Api.Data.Dtos;
using MoviesAndStuff.Api.Data.Enums;
using MoviesAndStuff.Api.Models;
using MoviesAndStuff.Api.Services.Interfaces;

namespace MoviesAndStuff.Api.Tests.Controllers
{
    public class MoviesControllerTests
    {
        private readonly Mock<IMovieService> _mockService;
        private readonly MoviesController _controller;

        public MoviesControllerTests()
        {
            _mockService = new Mock<IMovieService>();
            _controller = new MoviesController(_mockService.Object);
        }

        #region GetList Tests

        [Fact]
        public async Task GetList_WithoutFilters_ReturnsAllMovies()
        {
            // Arrange
            var expectedMovies = new List<MovieListDto>
            {
                new MovieListDto { Id = 1, Title = "Matrix", IsWatched = true, GenreName = "Sci-Fi" },
                new MovieListDto { Id = 2, Title = "Inception", IsWatched = false, GenreName = "Thriller" }
            };

            _mockService.Setup(s => s.GetMovieListAsync(null, null, WatchFilter.All))
                       .ReturnsAsync(expectedMovies);

            // Act
            var result = await _controller.GetList(null, null, WatchFilter.All);

            // Assert
            var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
            var movies = okResult.Value.Should().BeAssignableTo<List<MovieListDto>>().Subject;
            movies.Should().HaveCount(2);
            movies.Should().Contain(m => m.Title == "Matrix");
        }

        [Fact]
        public async Task GetList_WithSearchTerm_ReturnsFilteredMovies()
        {
            // Arrange
            var expectedMovies = new List<MovieListDto>
            {
                new MovieListDto { Id = 1, Title = "Matrix", IsWatched = true, GenreName = "Sci-Fi" }
            };

            _mockService.Setup(s => s.GetMovieListAsync("Matrix", null, WatchFilter.All))
                       .ReturnsAsync(expectedMovies);

            // Act
            var result = await _controller.GetList("Matrix", null, WatchFilter.All);

            // Assert
            var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
            var movies = okResult.Value.Should().BeAssignableTo<List<MovieListDto>>().Subject;
            movies.Should().HaveCount(1);
            movies.First().Title.Should().Be("Matrix");
        }

        [Theory]
        [InlineData(WatchFilter.Watched)]
        [InlineData(WatchFilter.Queue)]
        [InlineData(WatchFilter.All)]
        public async Task GetList_WithDifferentFilters_CallsServiceCorrectly(WatchFilter filter)
        {
            // Arrange
            _mockService.Setup(s => s.GetMovieListAsync(null, null, filter))
                       .ReturnsAsync(new List<MovieListDto>());

            // Act
            await _controller.GetList(null, null, filter);

            // Assert
            _mockService.Verify(s => s.GetMovieListAsync(null, null, filter), Times.Once);
        }

        #endregion 

        #region Get By Id Tests

        [Fact]
        public async Task Get_ExistingId_ReturnsMovie()
        {
            // Arrange
            var movie = new Movie { Id = 1, Title = "Matrix", IsWatched = true };
            _mockService.Setup(s => s.GetByIdAsync(1)).ReturnsAsync(movie);

            // Act
            var result = await _controller.Get(1);

            // Assert
            var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
            var returnedMovie = okResult.Value.Should().BeOfType<Movie>().Subject;
            returnedMovie.Id.Should().Be(1);
            returnedMovie.Title.Should().Be("Matrix");
        }

        [Fact]
        public async Task Get_NonExistingId_ReturnsNotFound()
        {
            // Arrange
            _mockService.Setup(s => s.GetByIdAsync(999)).ReturnsAsync((Movie?)null);

            // Act
            var result = await _controller.Get(999);

            // Assert
            result.Should().BeOfType<NotFoundResult>();
        }

        #endregion

        #region Create Tests

        [Fact]
        public async Task Create_ValidMovie_ReturnsCreatedAtAction()
        {
            // Arrange
            var newMovie = new Movie { Title = "New Movie", IsWatched = false };
            var createdMovie = new Movie { Id = 1, Title = "New Movie", IsWatched = false };

            _mockService.Setup(s => s.CreateAsync(It.IsAny<Movie>()))
                       .ReturnsAsync(createdMovie);

            // Act
            var result = await _controller.Create(newMovie);

            // Assert
            var createdResult = result.Should().BeOfType<CreatedAtActionResult>().Subject;
            createdResult.ActionName.Should().Be(nameof(MoviesController.Get));
            createdResult.RouteValues["id"].Should().Be(1);

            var returnedMovie = createdResult.Value.Should().BeOfType<Movie>().Subject;
            returnedMovie.Id.Should().Be(1);
        }

        [Fact]
        public async Task Create_InvalidModelState_ReturnsBadRequest()
        {
            // Arrange
            _controller.ModelState.AddModelError("Title", "Title is required");
            var movie = new Movie();

            // Act
            var result = await _controller.Create(movie);

            // Assert
            result.Should().BeOfType<BadRequestObjectResult>();
        }

        [Fact]
        public async Task Create_ServiceThrowsException_ReturnsBadRequest()
        {
            // Arrange
            var movie = new Movie { Title = "Test" };
            _mockService.Setup(s => s.CreateAsync(It.IsAny<Movie>()))
                       .ThrowsAsync(new Exception("Database error"));

            // Act
            var result = await _controller.Create(movie);

            // Assert
            var badRequestResult = result.Should().BeOfType<BadRequestObjectResult>().Subject;
            badRequestResult.Value.Should().Be("Database error");
        }

        #endregion

        #region Update Tests

        [Fact]
        public async Task Update_ValidMovie_ReturnsNoContent()
        {
            // Arrange
            var movie = new Movie { Id = 1, Title = "Updated Movie" };
            _mockService.Setup(s => s.UpdateAsync(It.IsAny<Movie>()))
                       .Returns(Task.CompletedTask);

            // Act
            var result = await _controller.Update(1, movie);

            // Assert
            result.Should().BeOfType<NoContentResult>();
            movie.Id.Should().Be(1); // Verifica se o ID foi setado
        }

        [Fact]
        public async Task Update_NonExistingMovie_ReturnsNotFound()
        {
            // Arrange
            var movie = new Movie { Id = 999, Title = "Non-existing" };
            _mockService.Setup(s => s.UpdateAsync(It.IsAny<Movie>()))
                       .ThrowsAsync(new DbUpdateConcurrencyException());

            // Act
            var result = await _controller.Update(999, movie);

            // Assert
            var notFoundResult = result.Should().BeOfType<NotFoundObjectResult>().Subject;
            notFoundResult.Value.Should().Be("Movie not found");
        }

        #endregion

        #region UpdateWatchStatus Tests

        [Fact]
        public async Task UpdateWatchStatus_ExistingMovie_ReturnsNoContent()
        {
            // Arrange
            _mockService.Setup(s => s.ToggleWatchedAsync(1)).ReturnsAsync(true);

            // Act
            var result = await _controller.UpdateWatchStatus(1);

            // Assert
            result.Should().BeOfType<NoContentResult>();
        }

        [Fact]
        public async Task UpdateWatchStatus_NonExistingMovie_ReturnsNotFound()
        {
            // Arrange
            _mockService.Setup(s => s.ToggleWatchedAsync(999)).ReturnsAsync(false);

            // Act
            var result = await _controller.UpdateWatchStatus(999);

            // Assert
            result.Should().BeOfType<NotFoundResult>();
        }

        #endregion

        #region Delete Tests

        [Fact]
        public async Task Delete_ExistingMovie_ReturnsNoContent()
        {
            // Arrange
            _mockService.Setup(s => s.DeleteAsync(1)).ReturnsAsync(true);

            // Act
            var result = await _controller.Delete(1);

            // Assert
            result.Should().BeOfType<NoContentResult>();
        }

        [Fact]
        public async Task Delete_NonExistingMovie_ReturnsNotFound()
        {
            // Arrange
            _mockService.Setup(s => s.DeleteAsync(999)).ReturnsAsync(false);

            // Act
            var result = await _controller.Delete(999);

            // Assert
            result.Should().BeOfType<NotFoundResult>();
        }

        #endregion

        #region GetGenreList Tests

        [Fact]
        public async Task GetGenreList_ReturnsAllGenres()
        {
            // Arrange
            var genres = new List<Genre>
            {
                new Genre { Id = "1", Name = "Action" },
                new Genre { Id = "2", Name = "Comedy" }
            };
            _mockService.Setup(s => s.GetGenresList()).ReturnsAsync(genres);

            // Act
            var result = await _controller.GetGenreList();

            // Assert
            var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
            var returnedGenres = okResult.Value.Should().BeAssignableTo<List<Genre>>().Subject;
            returnedGenres.Should().HaveCount(2);
        }

        #endregion
    }
}
