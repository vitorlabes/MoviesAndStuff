using MoviesAndStuff.Api.Services.Contracts;
using System.ComponentModel.DataAnnotations;

namespace MoviesAndStuff.Api.Data.Dtos.Movies
{
    public class CreateMovieDto : IHasGenre
    {
        [Required]
        [StringLength(100)]
        public string Title { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Review { get; set; }

        [StringLength(50)]
        public string? Director { get; set; }

        public long? GenreId { get; set; }

        [Range(1, 59999)]
        public int? Duration { get; set; }

        [Range(0, 10)]
        public decimal? Rating { get; set; }

        public DateTime? PremiereDate { get; set; }

        public DateTime? WatchDate { get; set; }

        public bool IsWatched { get; set; }
    }
}
