using MoviesAndStuff.Api.Models;

namespace MoviesAndStuff.Api.Data.Models
{
    public class GenreMediaType
    {
        public long Id { get; set; }
        public long GenreId { get; set; }
        public string MediaTypeId { get; set; } = string.Empty;
        public int Order { get; set; }
        public DateTime CreatedAt { get; set; }

        // Navigation properties
        public Genre Genre { get; set; } = null!;
        public MediaType MediaType { get; set; } = null!;
    }
}
