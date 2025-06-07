using Microsoft.AspNetCore.Components.Server.ProtectedBrowserStorage;
using Microsoft.EntityFrameworkCore;

public class MembershipDbContext : DbContext
{
    public MembershipDbContext(DbContextOptions<MembershipDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Spouse> Spouses => Set<Spouse>();
    public DbSet<Kid> Kids => Set<Kid>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure User entity
        modelBuilder.Entity<User>()
            .HasMany(u => u.Kids)
            .WithOne()
            .OnDelete(DeleteBehavior.Cascade);

    }
}
