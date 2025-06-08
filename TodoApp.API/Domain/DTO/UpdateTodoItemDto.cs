using System.ComponentModel.DataAnnotations;

namespace TodoApp.Domain.DTO 
{
    public class UpdateTodoItemDto
    {
        [Required]
        public string Title { get; set; }

        [Required]
        public bool Iscompleted { get; set; }
    }
}