using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MoviesAndStuff.Api.Data.Models;
using MoviesAndStuff.Api.Data.Seed;

namespace MoviesAndStuff.Api.Data.Configurations
{
    public class GenreMediaTypeConfiguration : IEntityTypeConfiguration<GenreMediaType>
    {
        public void Configure(EntityTypeBuilder<GenreMediaType> entity)
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

            entity.HasData(GenreMediaTypeSeed.Get());
        }
    }
}
