namespace MoviesAndStuff.Api.Data.Dtos.Games
{
    public class GameDetailDto
    {
        public long Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Review { get; set; }
        public string? Developer { get; set; }
        public long? GenreId { get; set; }
        public string? GenreName { get; set; }
        public decimal? Rating { get; set; }
        public DateTime? ReleaseDate { get; set; }
        public DateTime? PlayDate { get; set; }
        public bool IsPlayed { get; set; }
    }
}
