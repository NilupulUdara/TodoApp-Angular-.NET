using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TodoApp.CustomActionFilter;
using TodoApp.Domain.DTO;
using TodoApp.Domain.Model;

using TodoApp.Repositories;

namespace TodoApp.Controller
{
    [Route("api/[controller]")]
    [ApiController]

    public class TodoItemController : ControllerBase
    {
        private readonly ITodoItemRepository todoItemRepository;
        private readonly IMapper mapper;

        public TodoItemController(ITodoItemRepository todoItemRepository,
            IMapper mapper)
        {
            this.todoItemRepository = todoItemRepository;
            this.mapper = mapper;
        }

        [HttpGet]
        [Authorize(Roles = "Reader,Writer")]
        public async Task<IActionResult> GetAll()
        {
            var todos = await todoItemRepository.GetAllAsync();

            return Ok(mapper.Map<List<TodoItemDto>>(todos));
        }

        [HttpGet]
        [Route("{id:Guid}")]
        [Authorize(Roles = "Reader,Writer")]
        public async Task<IActionResult> GetById([FromRoute] Guid id)
        {
            var todo = await todoItemRepository.GetByIdAsync(id);

            if (todo == null)
            {
                return NotFound();
            }

            return Ok(mapper.Map<TodoItemDto>(todo));

        }

        [HttpPost]
        [ValidateModel]
        [Authorize(Roles = "Writer")]
        public async Task<IActionResult> Create([FromBody] AddTodoItemDto addTodoItemDto)
        {
            var todoDomain = mapper.Map<TodoItem>(addTodoItemDto);

            todoDomain = await todoItemRepository.CreateAsync(todoDomain);

            var todoDto = mapper.Map<TodoItemDto>(todoDomain);

            return CreatedAtAction(nameof(GetById), new { id = todoDomain.Id }, todoDto);
        }

        [HttpPut]
        [Route("{id:Guid}")]
        [ValidateModel]
        [Authorize(Roles = "Writer")]
        public async Task<IActionResult> Update([FromRoute] Guid id, [FromBody] UpdateTodoItemDto updateTodoItemDto)
        {
            var todoDomain = mapper.Map<TodoItem>(updateTodoItemDto);

            todoDomain = await todoItemRepository.UpdateAsync(id, todoDomain);

            if (todoDomain == null)
            {
                return NotFound();
            }
            return Ok(mapper.Map<TodoItemDto>(todoDomain));
        }

        [HttpDelete]
        [Route("{id:Guid}")]
        [Authorize(Roles = "Writer")]
        public async Task<IActionResult> Delete([FromRoute] Guid id)
        {
            var deletedItem = await todoItemRepository.DeleteAsync(id);

            if (deletedItem == null)
            {
                return NotFound();
            }

            return Ok(mapper.Map<TodoItemDto>(deletedItem));
        }
    }
}