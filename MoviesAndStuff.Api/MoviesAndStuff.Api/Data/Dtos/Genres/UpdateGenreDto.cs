using System.ComponentModel.DataAnnotations;

namespace MoviesAndStuff.Api.Data.Dtos.Genres
{
    public class UpdateGenreDto
    {
        [Required]
        [StringLength(50)]
        public string Name { get; set; } = string.Empty;
        public int Order { get; set; }
        public bool IsActive { get; set; } = true;
        public List<string> MediaTypeIds { get; set; } = new();
    }
}
