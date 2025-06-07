using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class User
{
    [Key]
    public int Id { get; set; }
    public string FirstName { get; set; } = default!;
    public string? MiddleName { get; set; }
    public string LastName { get; set; } = default!;
    public string Gender { get; set; } = default!;
    public string StreetAddress { get; set; } = default!;
    public string City { get; set; } = default!;
    public string State { get; set; } = default!;
    public string PhoneNumber { get; set; } = default!;
    public string EmailAddress { get; set; } = string.Empty;
    public string MemberType { get; set; } = "general"; // or "life"
    public bool Renewed { get; set; } = false;
    public Spouse? Spouse { get; set; }
    public List<Kid>? Kids { get; set; }
}

public class Spouse
{
    [Key]
    public int Id { get; set; }
    public string FirstName { get; set; } = default!;
    public string? MiddleName { get; set; }
    public string LastName { get; set; } = default!;
}

public class Kid
{
    [Key]
    public int Id { get; set; }
    public string FirstName { get; set; } = default!;
    public string? MiddleName { get; set; }
    public string LastName { get; set; } = default!;
}