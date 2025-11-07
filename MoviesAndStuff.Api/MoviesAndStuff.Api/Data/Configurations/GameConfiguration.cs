using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MoviesAndStuff.Api.Data.Models;
using MoviesAndStuff.Api.Models;

namespace MoviesAndStuff.Api.Data.Configurations
{
    public class GameConfiguration : IEntityTypeConfiguration<Game>
    {
        public void Configure(EntityTypeBuilder<Game> entity)
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
        }
    }
}
