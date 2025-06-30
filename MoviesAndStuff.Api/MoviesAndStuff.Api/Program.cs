using Microsoft.EntityFrameworkCore;
using MoviesAndStuff.Api.Data;
using MoviesAndStuff.Api.Services;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

var allowedOrigins = builder.Environment.IsDevelopment()
    ? new[] { "http://localhost:4200", "https://localhost:4200" }
    : new[] { "https://production-url" };

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    });

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<MovieService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials());
});

builder.WebHost.ConfigureKestrel(serverOptions => {
    serverOptions.ListenLocalhost(5100);
    serverOptions.ListenLocalhost(5102, listenOptions => { 
        listenOptions.UseHttps();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseCors("AllowAngular");
app.UseAuthorization();
app.MapControllers();

app.Run();
