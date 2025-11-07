using Microsoft.EntityFrameworkCore;
using MoviesAndStuff.Api.Data.Models;
using MoviesAndStuff.Api.Models;
using System.Reflection;

namespace MoviesAndStuff.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<MediaType> MediaTypes { get; set; }
        public DbSet<Genre> Genres { get; set; }
        public DbSet<GenreMediaType> GenreMediaTypes { get; set; }
        public DbSet<Movie> Movies { get; set; }
        public DbSet<Game> Games { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        }
    }
}
