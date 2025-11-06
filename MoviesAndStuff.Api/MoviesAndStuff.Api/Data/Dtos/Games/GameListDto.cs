namespace MoviesAndStuff.Api.Data.Dtos.Games
{
    public class GameListDto
    {
        public long Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateTime? PlayDate { get; set; }
        public bool IsPlayed { get; set; }
        public string? GenreName { get; set; }
    }
}
