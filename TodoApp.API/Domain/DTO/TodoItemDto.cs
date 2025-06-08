namespace TodoApp.Domain.DTO
{
    public class TodoItemDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public bool Iscompleted { get; set; }
    }
}