using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace MoviesAndStuff.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Genres",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Order = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Genres", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MediaTypes",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MediaTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Games",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Review = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Developer = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    GenreId = table.Column<long>(type: "bigint", nullable: true),
                    Rating = table.Column<decimal>(type: "DECIMAL(3,1)", nullable: true),
                    ReleaseDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    PlayDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsPlayed = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Games", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Games_Genres_GenreId",
                        column: x => x.GenreId,
                        principalTable: "Genres",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "Movies",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Review = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Director = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    GenreId = table.Column<long>(type: "bigint", nullable: true),
                    Duration = table.Column<int>(type: "int", nullable: true),
                    Rating = table.Column<decimal>(type: "DECIMAL(3,1)", nullable: true),
                    PremiereDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    WatchDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsWatched = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Movies", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Movies_Genres_GenreId",
                        column: x => x.GenreId,
                        principalTable: "Genres",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "GenreMediaTypes",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    GenreId = table.Column<long>(type: "bigint", nullable: false),
                    MediaTypeId = table.Column<string>(type: "nvarchar(20)", nullable: false),
                    Order = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GenreMediaTypes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GenreMediaTypes_Genres_GenreId",
                        column: x => x.GenreId,
                        principalTable: "Genres",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GenreMediaTypes_MediaTypes_MediaTypeId",
                        column: x => x.MediaTypeId,
                        principalTable: "MediaTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Genres",
                columns: new[] { "Id", "IsActive", "Name", "Order", "UpdatedAt" },
                values: new object[,]
                {
                    { 1L, true, "Action", 1, null },
                    { 2L, true, "Adventure", 2, null },
                    { 3L, true, "Comedy", 3, null },
                    { 4L, true, "Drama", 4, null },
                    { 5L, true, "Horror", 5, null },
                    { 6L, true, "Romance", 6, null },
                    { 7L, true, "Sci-Fi", 7, null },
                    { 8L, true, "Thriller", 8, null },
                    { 9L, true, "Fantasy", 9, null },
                    { 10L, true, "RPG", 10, null },
                    { 11L, true, "Strategy", 11, null },
                    { 12L, true, "FPS", 12, null },
                    { 13L, true, "Platformer", 13, null },
                    { 14L, true, "Sports", 14, null },
                    { 15L, true, "Racing", 15, null },
                    { 16L, true, "Crime", 16, null },
                    { 17L, true, "Documentary", 17, null }
                });

            migrationBuilder.InsertData(
                table: "MediaTypes",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { "GAME", "Game" },
                    { "MOVIE", "Movie" },
                    { "SERIES", "Series" }
                });

            migrationBuilder.InsertData(
                table: "GenreMediaTypes",
                columns: new[] { "Id", "GenreId", "MediaTypeId", "Order" },
                values: new object[,]
                {
                    { 1L, 1L, "MOVIE", 1 },
                    { 2L, 2L, "MOVIE", 2 },
                    { 3L, 3L, "MOVIE", 3 },
                    { 4L, 4L, "MOVIE", 4 },
                    { 5L, 5L, "MOVIE", 5 },
                    { 6L, 6L, "MOVIE", 6 },
                    { 7L, 7L, "MOVIE", 7 },
                    { 8L, 8L, "MOVIE", 8 },
                    { 9L, 9L, "MOVIE", 9 },
                    { 10L, 1L, "GAME", 1 },
                    { 11L, 2L, "GAME", 2 },
                    { 12L, 10L, "GAME", 3 },
                    { 13L, 11L, "GAME", 4 },
                    { 14L, 12L, "GAME", 5 },
                    { 15L, 13L, "GAME", 6 },
                    { 16L, 14L, "GAME", 7 },
                    { 17L, 15L, "GAME", 8 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Games_GenreId",
                table: "Games",
                column: "GenreId");

            migrationBuilder.CreateIndex(
                name: "IX_GenreMediaTypes_GenreId_MediaTypeId",
                table: "GenreMediaTypes",
                columns: new[] { "GenreId", "MediaTypeId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GenreMediaTypes_MediaTypeId",
                table: "GenreMediaTypes",
                column: "MediaTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Genres_Name",
                table: "Genres",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MediaTypes_Name",
                table: "MediaTypes",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Movies_GenreId",
                table: "Movies",
                column: "GenreId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Games");

            migrationBuilder.DropTable(
                name: "GenreMediaTypes");

            migrationBuilder.DropTable(
                name: "Movies");

            migrationBuilder.DropTable(
                name: "MediaTypes");

            migrationBuilder.DropTable(
                name: "Genres");
        }
    }
}
