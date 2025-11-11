using MoviesAndStuff.Api.Services.Contracts;
using System.ComponentModel.DataAnnotations;

namespace MoviesAndStuff.Api.Data.Dtos.Games
{
    public class UpdateGameDto : IHasGenre
    {
        [Required]
        [StringLength(100)]
        public string Title { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Review { get; set; }

        [StringLength(50)]
        public string? Developer { get; set; }

        public long? GenreId { get; set; }

        [Range(0, 10)]
        public decimal? Rating { get; set; }

        public DateTime? ReleaseDate { get; set; }

        public DateTime? PlayDate { get; set; }

        public bool IsPlayed { get; set; }
    }
}
