using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MoviesAndStuff.Api.Data.Models;
using MoviesAndStuff.Api.Data.Seed;

namespace MoviesAndStuff.Api.Data.Configurations
{
    public class MediaTypeConfiguration : IEntityTypeConfiguration<MediaType>
    {
        public void Configure(EntityTypeBuilder<MediaType> entity)
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

            entity.HasData(MediaTypeSeed.Get());
        }
    }
}
