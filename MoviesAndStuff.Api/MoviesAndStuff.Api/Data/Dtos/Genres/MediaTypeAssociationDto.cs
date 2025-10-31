namespace MoviesAndStuff.Api.Data.Dtos.Genres
{
    public class MediaTypeAssociationDto
    {
        public string MediaTypeId { get; set; } = string.Empty;
        public string MediaTypeName { get; set; } = string.Empty;
        public int Order { get; set; }
    }
}
