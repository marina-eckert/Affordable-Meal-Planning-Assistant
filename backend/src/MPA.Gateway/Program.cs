using MPA.Gateway.Constants;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection(ConfigurationKeys.ReverseProxy));

var app = builder.Build();

app.MapReverseProxy();

app.Run();
