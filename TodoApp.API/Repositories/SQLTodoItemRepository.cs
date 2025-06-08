using Microsoft.EntityFrameworkCore;
using TodoApp.Data;
using TodoApp.Domain.Model;

namespace  TodoApp.Repositories
{
    public class SQLTodoItemRepository : ITodoItemRepository
    {
        private readonly TodoDbContext todoDbContext;

        public SQLTodoItemRepository(TodoDbContext todoDbContext)
        {
            this.todoDbContext = todoDbContext;
        }

        public async Task<TodoItem> CreateAsync(TodoItem todoItem)
        {
            await todoDbContext.TodoItems.AddAsync(todoItem);
            await todoDbContext.SaveChangesAsync();
            return (todoItem);
        }

        public async Task<TodoItem?> DeleteAsync(Guid id)
        {
            var existingItem = await todoDbContext.TodoItems.FirstOrDefaultAsync(x => x.Id == id);

            if(existingItem == null)
            {
                return null;
            }

            todoDbContext.TodoItems.Remove(existingItem);
            await todoDbContext.SaveChangesAsync();
            return existingItem;
        }

        public async Task<List<TodoItem>> GetAllAsync()
        {
            return await todoDbContext.TodoItems.ToListAsync();
        }

        public async Task<TodoItem?> GetByIdAsync(Guid id)
        {
            return await todoDbContext.TodoItems.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<TodoItem?> UpdateAsync(Guid id, TodoItem todoItem)
        {
            var existingItem = await todoDbContext.TodoItems.FirstOrDefaultAsync(x => x.Id == id);

            if(existingItem == null)
            {
                return null;
            }

            existingItem.Title = todoItem.Title;
            existingItem.Iscompleted = todoItem.Iscompleted;
            
            await todoDbContext.SaveChangesAsync();
            return existingItem;
        }
    }
}