using Microsoft.EntityFrameworkCore;
using MoviesAndStuff.Api.Data.Models;
using MoviesAndStuff.Api.Models;

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

            // MediaType Configuration
            modelBuilder.Entity<MediaType>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Id)
                    .HasMaxLength(20)
                    .IsRequired()
                    .ValueGeneratedNever();

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(20);

                entity.HasIndex(e => e.Name).IsUnique();
                entity.Property(e => e.CreatedAt)
                    .HasDefaultValueSql("GETDATE()");

                // Seed
                entity.HasData(
                    new MediaType { Id = "MOVIE", Name = "Movie" },
                    new MediaType { Id = "GAME", Name = "Game" },
                    new MediaType { Id = "SERIES", Name = "Series" }
                );
            });


            // Genre Configuration
            modelBuilder.Entity<Genre>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(50);
                entity.HasIndex(e => e.Name).IsUnique();
                entity.Property(e => e.IsActive).HasDefaultValue(true);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETDATE()");

                // Seed
                entity.HasData(
                    new Genre { Id = 1, Name = "Action", Order = 1, IsActive = true },
                    new Genre { Id = 2, Name = "Adventure", Order = 2, IsActive = true },
                    new Genre { Id = 3, Name = "Comedy", Order = 3, IsActive = true },
                    new Genre { Id = 4, Name = "Drama", Order = 4, IsActive = true },
                    new Genre { Id = 5, Name = "Horror", Order = 5, IsActive = true },
                    new Genre { Id = 6, Name = "Romance", Order = 6, IsActive = true },
                    new Genre { Id = 7, Name = "Sci-Fi", Order = 7, IsActive = true },
                    new Genre { Id = 8, Name = "Thriller", Order = 8, IsActive = true },
                    new Genre { Id = 9, Name = "Fantasy", Order = 9, IsActive = true },
                    new Genre { Id = 10, Name = "RPG", Order = 10, IsActive = true },
                    new Genre { Id = 11, Name = "Strategy", Order = 11, IsActive = true },
                    new Genre { Id = 12, Name = "FPS", Order = 12, IsActive = true },
                    new Genre { Id = 13, Name = "Platformer", Order = 13, IsActive = true },
                    new Genre { Id = 14, Name = "Sports", Order = 14, IsActive = true },
                    new Genre { Id = 15, Name = "Racing", Order = 15, IsActive = true },
                    new Genre { Id = 16, Name = "Crime", Order = 16, IsActive = true },
                    new Genre { Id = 17, Name = "Documentary", Order = 17, IsActive = true }
                );
            });

            // GenreMediaType Configuration
            modelBuilder.Entity<GenreMediaType>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.HasOne(e => e.Genre)
                    .WithMany(g => g.GenreMediaTypes)
                    .HasForeignKey(e => e.GenreId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.MediaType)
                    .WithMany(m => m.GenreMediaTypes)
                    .HasForeignKey(e => e.MediaTypeId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(e => new { e.GenreId, e.MediaTypeId }).IsUnique();
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETDATE()");

                // Seed
                entity.HasData(
                    new GenreMediaType { Id = 1, GenreId = 1, MediaTypeId = "MOVIE", Order = 1 },
                    new GenreMediaType { Id = 2, GenreId = 2, MediaTypeId = "MOVIE", Order = 2 },
                    new GenreMediaType { Id = 3, GenreId = 3, MediaTypeId = "MOVIE", Order = 3 },
                    new GenreMediaType { Id = 4, GenreId = 4, MediaTypeId = "MOVIE", Order = 4 },
                    new GenreMediaType { Id = 5, GenreId = 5, MediaTypeId = "MOVIE", Order = 5 },
                    new GenreMediaType { Id = 6, GenreId = 6, MediaTypeId = "MOVIE", Order = 6 },
                    new GenreMediaType { Id = 7, GenreId = 7, MediaTypeId = "MOVIE", Order = 7 },
                    new GenreMediaType { Id = 8, GenreId = 8, MediaTypeId = "MOVIE", Order = 8 },
                    new GenreMediaType { Id = 9, GenreId = 9, MediaTypeId = "MOVIE", Order = 9 },

                    new GenreMediaType { Id = 10, GenreId = 1, MediaTypeId = "GAME", Order = 1 },
                    new GenreMediaType { Id = 11, GenreId = 2, MediaTypeId = "GAME", Order = 2 },
                    new GenreMediaType { Id = 12, GenreId = 10, MediaTypeId = "GAME", Order = 3 },
                    new GenreMediaType { Id = 13, GenreId = 11, MediaTypeId = "GAME", Order = 4 },
                    new GenreMediaType { Id = 14, GenreId = 12, MediaTypeId = "GAME", Order = 5 },
                    new GenreMediaType { Id = 15, GenreId = 13, MediaTypeId = "GAME", Order = 6 },
                    new GenreMediaType { Id = 16, GenreId = 14, MediaTypeId = "GAME", Order = 7 },
                    new GenreMediaType { Id = 17, GenreId = 15, MediaTypeId = "GAME", Order = 8 }
                );
            });

            // Movie Configuration
            modelBuilder.Entity<Movie>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Review).HasMaxLength(500);
                entity.Property(e => e.Director).HasMaxLength(50);
                entity.Property(e => e.Rating).HasColumnType("DECIMAL(3,1)");
                entity.Property(e => e.IsWatched).HasDefaultValue(false);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETDATE()");

                entity.HasOne(e => e.Genre)
                    .WithMany(g => g.Movies)
                    .HasForeignKey(e => e.GenreId)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasIndex(e => e.GenreId);
            });

            // Game Configuration
            modelBuilder.Entity<Game>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Review).HasMaxLength(500);
                entity.Property(e => e.Developer).HasMaxLength(50);
                entity.Property(e => e.Rating).HasColumnType("DECIMAL(3,1)");
                entity.Property(e => e.IsPlayed).HasDefaultValue(false);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETDATE()");

                entity.HasOne(e => e.Genre)
                    .WithMany(g => g.Games)
                    .HasForeignKey(e => e.GenreId)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasIndex(e => e.GenreId);
            });
        }
    }
}
