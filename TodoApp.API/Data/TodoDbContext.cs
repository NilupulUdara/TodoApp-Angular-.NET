using Microsoft.EntityFrameworkCore;
using TodoApp.Domain.Model;

namespace  TodoApp.Data
{
    public class TodoDbContext : DbContext
    {
        public TodoDbContext(DbContextOptions<TodoDbContext> dbContextOptions) : base(dbContextOptions)
        {

        }
        public DbSet<TodoItem> TodoItems { get; set; }
    }
}