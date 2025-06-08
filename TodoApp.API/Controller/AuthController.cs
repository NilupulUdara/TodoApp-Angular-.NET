using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using NZWalks.API.Models.DTO;
using TodoApp.Domain.DTO;
using TodoApp.Repositories;
using Microsoft.AspNetCore.Authorization;

namespace TodoApp.API.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<IdentityUser> userManager;
        private readonly ITokenRepository tokenRepository;

        public AuthController(UserManager<IdentityUser> userManager, ITokenRepository tokenRepository)
        {
            this.userManager = userManager;
            this.tokenRepository = tokenRepository;
        }

        [HttpPost]
        [Route("Register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto registerRequestDto)
        {
            var identityUser = new IdentityUser
            {
                UserName = registerRequestDto.Username,
                Email = registerRequestDto.Username
            };

            var identityResult = await userManager.CreateAsync(identityUser, registerRequestDto.Password);

            if (!identityResult.Succeeded)
            {
                return BadRequest(new
                {
                    Message = "User creation failed",
                    Errors = identityResult.Errors.Select(e => e.Description)
                });
            }

            if (registerRequestDto.Roles != null && registerRequestDto.Roles.Any())
            {
                var roleResult = await userManager.AddToRolesAsync(identityUser, registerRequestDto.Roles);

                if (!roleResult.Succeeded)
                {
                    return BadRequest(new
                    {
                        Message = "Role assignment failed",
                        Errors = roleResult.Errors.Select(e => e.Description)
                    });
                }
            }

            return Ok("User was registered");
        }


        [HttpPost]
        [Route("Login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto loginRequestDto)
        {
            var user = await userManager.FindByEmailAsync(loginRequestDto.Username);

            if (user != null)
            {
                var checkPasswordResult = await userManager.CheckPasswordAsync(user, loginRequestDto.Password);

                if (checkPasswordResult)
                {
                    var roles = await userManager.GetRolesAsync(user);

                    if (roles != null)
                    {
                        var jwtToken = tokenRepository.CreateJWTToken(user, roles.ToList());

                        var response = new LoginResponseDto
                        {
                            JwtToken = jwtToken
                        };

                        return Ok(response);
                    }

                }
            }

            return BadRequest("Invalid Username or Password");
        }
    }
}