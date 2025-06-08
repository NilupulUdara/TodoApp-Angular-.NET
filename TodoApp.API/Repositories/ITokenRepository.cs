using Microsoft.AspNetCore.Identity;

namespace TodoApp.Repositories
{
    public interface ITokenRepository
    {
        string CreateJWTToken(IdentityUser user, List<string> roles);
    }
}