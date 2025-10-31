using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using MoviesAndStuff.Api.Data;
using MoviesAndStuff.Api.Services;
using MoviesAndStuff.Api.Services.Interfaces;
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

var allowedOrigins = builder.Environment.IsDevelopment()
    ? new[] { "http://localhost:4200", "https://localhost:4200" }
    : new[] { "https://production-url" };

//Controllers
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

//Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

//DI
builder.Services.AddScoped<IMovieService, MovieService>();
builder.Services.AddScoped<IGenreService, GenreService>();

//OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Media Tracker API",
        Version = "v1",
        Description = "API for tracking movies, games, and series"
    });
});

//CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials());
});

//Kestrel
builder.WebHost.ConfigureKestrel(serverOptions => {
    serverOptions.ListenLocalhost(5100);
    serverOptions.ListenLocalhost(5102, listenOptions => { 
        listenOptions.UseHttps();
    });
});

var app = builder.Build();

//Environment
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Media Tracker API V1");
    });
}

//Middlewares
app.UseHttpsRedirection();
app.UseRouting();
app.UseCors("AllowAngular");
app.UseAuthorization();
app.MapControllers();

app.Run();