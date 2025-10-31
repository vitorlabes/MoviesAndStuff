namespace MoviesAndStuff.Api.Data.Dtos.Genres
{
    public class GenreDetailDto
    {
        public long Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Order { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public List<MediaTypeAssociationDto> MediaTypes { get; set; } = new();
    }
}
