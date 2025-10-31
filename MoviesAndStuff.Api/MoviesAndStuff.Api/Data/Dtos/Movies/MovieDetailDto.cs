namespace MoviesAndStuff.Api.Data.Dtos.Movies
{
    public class MovieDetailDto
    {
        public long Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Review { get; set; }
        public string? Director { get; set; }
        public long? GenreId { get; set; }
        public string? GenreName { get; set; }
        public int? Duration { get; set; }
        public decimal? Rating { get; set; }
        public DateTime? PremiereDate { get; set; }
        public DateTime? WatchDate { get; set; }
        public bool IsWatched { get; set; }
    }
}
