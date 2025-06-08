using TodoApp.Domain.Model;

namespace  TodoApp.Repositories
{
    public interface ITodoItemRepository
    {
        Task<List<TodoItem>> GetAllAsync();
        Task<TodoItem?> GetByIdAsync(Guid id);
        Task<TodoItem> CreateAsync(TodoItem todoItem);
        Task<TodoItem?> UpdateAsync(Guid id, TodoItem todoItem);
        Task<TodoItem?> DeleteAsync(Guid id);
    }   
}