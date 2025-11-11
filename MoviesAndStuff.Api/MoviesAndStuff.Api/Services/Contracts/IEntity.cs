namespace MoviesAndStuff.Api.Services.Contracts
{
    /// <summary>
    /// Defines entities with and ID property.
    /// </summary>
    public interface IEntity
    {
        long Id { get; set; }
    }
}
