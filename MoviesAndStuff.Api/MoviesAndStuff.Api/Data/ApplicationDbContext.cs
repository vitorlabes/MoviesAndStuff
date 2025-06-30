using Microsoft.EntityFrameworkCore;
using MoviesAndStuff.Api.Models;

namespace MoviesAndStuff.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Movie> Movies { get; set; }

        public DbSet<Genre> Genres { get; set; }
    }
}
