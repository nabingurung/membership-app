using System.Threading;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

builder.Services.AddDbContext<MembershipDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

var app = builder.Build();

var maxRetries = 10;
var delayMs = 3000;
var retries = 0;
var migrated = false;

while (!migrated && retries < maxRetries)
{
    try
    {
        using (var scope = app.Services.CreateScope())
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<MembershipDbContext>();
            dbContext.Database.Migrate();
            // Optionally: SeedDatabase(dbContext);
            migrated = true;
        }
    }
    catch (Exception ex)
    {
        retries++;
        Console.WriteLine($"Database not ready, retrying in {delayMs / 1000} seconds... ({retries}/{maxRetries})");
        Thread.Sleep(delayMs);
    }
}

if (!migrated)
{
    throw new Exception("Could not connect to the database after multiple retries.");
}

// Apply CORS policy
app.UseCors("AllowAll");
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.MapControllers();

app.Run();
