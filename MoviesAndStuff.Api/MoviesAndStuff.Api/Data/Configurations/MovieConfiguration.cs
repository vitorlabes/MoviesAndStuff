using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MoviesAndStuff.Api.Models;

namespace MoviesAndStuff.Api.Data.Configurations
{
    public class MovieConfiguration : IEntityTypeConfiguration<Movie>
    {
        public void Configure(EntityTypeBuilder<Movie> entity)
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
        }
    }
}
