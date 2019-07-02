using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace QandA.Pages.Identity.Account
{
    public class RegisterCallbackModel : PageModel
    {
        public IActionResult OnGet()
        {
            return Redirect("http://localhost:3000/");
        }
    }
}