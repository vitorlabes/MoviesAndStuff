namespace MoviesAndStuff.Api.Models
{
    public class Genre
    {
        public string Id { get; set; } = string.Empty;

        public string Name { get; set; } = string.Empty;

        public int Order {  get; set; }

        public bool Active { get; set; }     
    }
}
