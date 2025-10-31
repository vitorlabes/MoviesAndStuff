namespace MoviesAndStuff.Api.Data.Dtos
{
    public class GenreListDto
    {
        public long Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Order { get; set; }
        public bool IsActive { get; set; }  
        public List<string> MediaTypes { get; set; } = new();
    }
}
