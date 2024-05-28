using System.Security.Claims;
using IdentityModel;
using IdentityService.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace IdentityService.Pages.Account.Register;

[SecurityHeaders]
[AllowAnonymous]
public class Index : PageModel
{
    private readonly UserManager<ApplicationUser> _userManager;

    public Index(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    [BindProperty] public RegisterViewModel Input { get; set; }

    [BindProperty] public bool RegisterSuccess { get; set; }

    public IActionResult OnGet(string returnUrl)
    {
        Input = new RegisterViewModel
        {
            ReturnUrl = returnUrl,
        };

        return Page();
    }

    public async Task<IActionResult> OnPost()
    {
        // If the button pressed is not "register", redirect to home page
        if (Input.Button != "register")
        {
            return Redirect("~/");
        }

        // If the model state is not valid, return early
        if (!ModelState.IsValid) return Page();
            
        // Create a new application user with the input email and confirm the email
        var user = new ApplicationUser
        {
            UserName = Input.Email,
            Email = Input.Email,
            EmailConfirmed = true,
        };

        // Attempt to create the user with the provided password
        var result = await _userManager.CreateAsync(user, Input.Password);

        // If creation failed, return early
        if (!result.Succeeded) return Page();
            
        // Add claims to the user for their full name
        await _userManager.AddClaimsAsync(user, new Claim[]
        {
            new Claim(JwtClaimTypes.Name, Input.FullName),
        });
            
        // Set the registration success flag and return the current page
        RegisterSuccess = true;

        return Page();
    }
}