using System.ComponentModel.DataAnnotations;

namespace MoviesAndStuff.Api.Data.Dtos.Genres
{
    public class MediaTypeListDto
    {
        [Required]
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
    }
}
