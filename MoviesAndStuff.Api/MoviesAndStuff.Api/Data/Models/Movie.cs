namespace MoviesAndStuff.Api.Models
{
    public class Movie
    {
        public long Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Review { get; set; } = string.Empty;
        public string? Director { get; set; } = string.Empty;
        public string?GenreId { get; set; } = string.Empty;
        public string? Duration { get; set; } = string.Empty;
        public decimal Rating { get; set; }
        public DateTime? PremiereDate { get; set; }
        public DateTime? WatchDate { get; set; }
        public bool IsWatched { get; set; }

        public Genre? Genre { get; set; }
    }
}
