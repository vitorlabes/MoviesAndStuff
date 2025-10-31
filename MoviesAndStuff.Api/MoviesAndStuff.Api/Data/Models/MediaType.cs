using System.ComponentModel.DataAnnotations;

namespace MoviesAndStuff.Api.Data.Models
{
    public class MediaType
    {
        [Key]
        [MaxLength(20)]
        public string Id { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string Name { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }

        // Navigation properties
        public ICollection<GenreMediaType> GenreMediaTypes { get; set; } = new List<GenreMediaType>();
    }
}
