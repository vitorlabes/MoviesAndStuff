using System.ComponentModel.DataAnnotations;

namespace MoviesAndStuff.Api.Models
{
    public class Movie
    {
        public long Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Title { get; set; } = string.Empty;

        [StringLength(200)]
        public string? Review { get; set; }

        [StringLength(50)]
        public string? Director { get; set; }

        public string? GenreId { get; set; }

        /// <summary>
        /// Duration in minutes
        /// </summary>
        [Range(1, 59999)] // Max 999:59
        public int? Duration { get; set; }

        [Range(0, 10)]
        public decimal Rating { get; set; }

        public DateTime? PremiereDate { get; set; }

        public DateTime? WatchDate { get; set; }

        public bool IsWatched { get; set; }

        // Navigation property
        public Genre? Genre { get; set; }
    }
}
