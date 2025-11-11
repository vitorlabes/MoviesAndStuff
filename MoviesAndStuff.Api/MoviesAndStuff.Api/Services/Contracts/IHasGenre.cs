namespace MoviesAndStuff.Api.Services.Contracts
{
    /// <summary>
    /// Defines an entity that is associated with a genre.
    /// </summary>
    public interface IHasGenre
    {
        /// <summary>
        /// Gets the foreign key identifier of the associated genre, if any.
        /// </summary>
        long? GenreId { get; }
    }
}
