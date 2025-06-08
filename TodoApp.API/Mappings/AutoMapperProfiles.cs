using AutoMapper;
using TodoApp.Domain.DTO;
using TodoApp.Domain.Model;

namespace TodoApp.Mappings
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<TodoItem, TodoItemDto>().ReverseMap();
            CreateMap<TodoItem, AddTodoItemDto>().ReverseMap();
            CreateMap<TodoItem, UpdateTodoItemDto>().ReverseMap();
        }
    }
}