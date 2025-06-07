public static class UserRepository
{
    private static readonly List<User> Users = new();
    private static int _id = 1;

    public static IEnumerable<User> GetAll() => Users;
    public static User? Get(int id) => Users.FirstOrDefault(u => u.Id == id);

    public static User Add(User user)
    {
        user.Id = _id++;
        Users.Add(user);
        return user;
    }

    public static void Update(User user)
    {
        var index = Users.FindIndex(u => u.Id == user.Id);
        if (index != -1)
            Users[index] = user;
    }

    public static void Delete(int id)
    {
        var user = Get(id);
        if (user != null)
            Users.Remove(user);
    }
}