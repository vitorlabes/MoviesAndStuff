namespace MoviesAndStuff.Api.Data.Dtos.Movies
{
    public class MovieListDto
    {
        public long Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateTime? WatchDate { get; set; }
        public bool IsWatched { get; set; }
        public string? GenreName { get; set; }
    }
}
