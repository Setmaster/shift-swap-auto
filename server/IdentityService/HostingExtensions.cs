using Duende.IdentityServer;
using Duende.IdentityServer.Services;
using IdentityService.Data;
using IdentityService.Models;
using IdentityService.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Serilog;

namespace IdentityService;

internal static class HostingExtensions
{
    public static WebApplication ConfigureServices(this WebApplicationBuilder builder)
    {
        builder.Services.AddRazorPages();

        builder.Services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

        builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

        builder.Services
            .AddIdentityServer(cfg =>
            {
                cfg.Events.RaiseErrorEvents = true;
                cfg.Events.RaiseInformationEvents = true;
                cfg.Events.RaiseFailureEvents = true;
                cfg.Events.RaiseSuccessEvents = true;

                if (builder.Environment.IsEnvironment("Docker"))
                {
                    cfg.IssuerUri = "identity-service";
                }

                // see https://docs.duendesoftware.com/identityserver/v6/fundamentals/resources/
                cfg.EmitStaticAudienceClaim = true;
            })
            .AddInMemoryIdentityResources(Config.IdentityResources)
            .AddInMemoryApiScopes(Config.ApiScopes)
            .AddInMemoryClients(Config.Clients(builder.Configuration))
            .AddAspNetIdentity<ApplicationUser>()
            .AddProfileService<CustomProfileService>();

        builder.Services.ConfigureApplicationCookie(cfg =>
        {
            // SameSite=Lax allows the cookie to be sent with top-level navigations 
            cfg.Cookie.SameSite = SameSiteMode.Lax;
        });

        builder.Services.AddAuthentication();

        return builder.Build();
    }

    public static WebApplication ConfigurePipeline(this WebApplication app)
    {
        app.UseSerilogRequestLogging();

        if (app.Environment.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseStaticFiles();
        app.UseRouting();

        if (app.Environment.IsDevelopment())
        {
            app.Use(async (ctx, next) =>
            {
                var serverUrls = ctx.RequestServices.GetRequiredService<IServerUrls>();
                serverUrls.Origin = serverUrls.Origin =
                    Environment.GetEnvironmentVariable("ORIGIN") ?? "https://id.shiftswap.vi7.org";
                await next();
            });
        }

        app.UseIdentityServer();
        app.UseAuthorization();

        app.MapRazorPages()
            .RequireAuthorization();

        return app;
    }
}