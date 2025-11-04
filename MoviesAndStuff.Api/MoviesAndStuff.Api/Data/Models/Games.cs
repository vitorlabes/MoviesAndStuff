using MoviesAndStuff.Api.Models;
using System.ComponentModel.DataAnnotations;

namespace MoviesAndStuff.Api.Data.Models
{
    public class Game
    {
        public long Id { get; set; }

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

        public DateTime CreatedAt { get; set; }

        // Navigation property
        public Genre? Genre { get; set; }
    }
}
