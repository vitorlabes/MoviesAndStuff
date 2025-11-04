using MoviesAndStuff.Api.Data.Models;
using System.ComponentModel.DataAnnotations;

namespace MoviesAndStuff.Api.Models
{
    public class Genre
    {
        public long Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Name { get; set; } = string.Empty;

        public int Order { get; set; }

        public bool IsActive { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        public ICollection<GenreMediaType> GenreMediaTypes { get; set; } = new List<GenreMediaType>();
        public ICollection<Movie> Movies { get; set; } = new List<Movie>();
        public ICollection<Game> Games { get; set; } = new List<Game>();
    }
}
