namespace TodoApp.Domain.Model
{
    public class TodoItem
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public bool Iscompleted { get; set; }
    }
}