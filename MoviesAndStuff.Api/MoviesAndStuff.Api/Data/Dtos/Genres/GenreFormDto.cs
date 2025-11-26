using System.ComponentModel.DataAnnotations;

namespace MoviesAndStuff.Api.Data.Dtos.Genres
{
    public class GenreFormDto
    {
        [Required]
        [StringLength(50)]
        public string Name { get; set; } = string.Empty;
        public List<string> MediaTypeIds { get; set; } = new();
    }
}
