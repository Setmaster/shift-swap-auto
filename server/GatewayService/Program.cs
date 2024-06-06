using Microsoft.AspNetCore.Authentication.JwtBearer;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(cfg =>
    {
        cfg.Authority = builder.Configuration["IdentityServiceUrl"];
        cfg.RequireHttpsMetadata = false;

        // Set the audience validation to false, as we are not using the audience claim
        cfg.TokenValidationParameters.ValidateAudience = false;

        // Set the claim type to be used as the name identifier
        cfg.TokenValidationParameters.NameClaimType = "username";
    });

builder.Services.AddCors(cfg =>
{
    cfg.AddPolicy("customPolicy", b =>
    {
        b.AllowAnyMethod()
            .AllowCredentials()
            .WithOrigins(builder.Configuration["ClientApp"]);
    });
});
var app = builder.Build();

app.UseCors();

app.MapReverseProxy();
app.UseAuthentication();
app.UseAuthorization();
app.Run();