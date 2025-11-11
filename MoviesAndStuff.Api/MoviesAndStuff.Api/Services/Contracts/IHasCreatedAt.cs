namespace MoviesAndStuff.Api.Services.Contracts
{
    /// <summary>
    /// Defines an entity that tracks its creation timestamp.
    /// </summary>
    public interface IHasCreatedAt
    {
        DateTime CreatedAt { get; set; }
    }
}
