namespace MoviesAndStuff.Api.Models
{
    public class Genre
    {
        public string id { get; set; } = string.Empty;

        public string name { get; set; } = string.Empty;

        public int order {  get; set; }

        public bool active { get; set; }     
    }
}
