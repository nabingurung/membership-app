using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly MembershipDbContext _context;
    public UserController(MembershipDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _context.Users.Include(u => u.Spouse).Include(u => u.Kids).ToListAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var user = await _context.Users.Include(u => u.Spouse).Include(u => u.Kids).FirstOrDefaultAsync(u => u.Id == id);
        if (user == null) return NotFound();
        return Ok(user);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] User user)
    {
        if(user.MemberType.ToUpper() =="LIFE")
        {
            user.Renewed = true; // Automatically set Renewed to true for life members
        }
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = user.Id }, user);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] User user)
    {
        if (id != user.Id) return BadRequest();

        var existingUser = await _context.Users
            .Include(u => u.Spouse)
            .Include(u => u.Kids)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (existingUser == null) return NotFound();

        // Update scalar properties
        _context.Entry(existingUser).CurrentValues.SetValues(user);

        // set renewed to true for life members
        if (user.MemberType.ToUpper() == "LIFE")
        {
            existingUser.Renewed = true;
        }
        
        // Update Spouse
        if (user.Spouse != null)
        {
            if (existingUser.Spouse == null)
            {
                existingUser.Spouse = user.Spouse;
            }
            else
            {
                _context.Entry(existingUser.Spouse).CurrentValues.SetValues(user.Spouse);
            }
        }
        else if (existingUser.Spouse != null)
        {
            _context.Remove(existingUser.Spouse);
            existingUser.Spouse = null;
        }

        // Update Kids
        // Remove kids not present in the new list
        if (existingUser.Kids != null)
        {
            foreach (var existingKid in existingUser.Kids.ToList())
            {
                if (user.Kids == null || !user.Kids.Any(k => k.Id == existingKid.Id))
                {
                    _context.Remove(existingKid);
                }
            }
        }

        // Add or update kids
        if (user.Kids != null)
        {
            foreach (var kid in user.Kids)
            {
                var existingKid = existingUser.Kids?.FirstOrDefault(k => k.Id == kid.Id);
                if (existingKid != null)
                {
                    _context.Entry(existingKid).CurrentValues.SetValues(kid);
                }
                else
                {
                    existingUser.Kids.Add(kid);
                }
            }
        }

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();
        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}