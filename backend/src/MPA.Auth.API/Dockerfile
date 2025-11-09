FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY . .

RUN dotnet restore MPA.Auth.API/MPA.Auth.API.csproj

RUN dotnet publish MPA.Auth.API/MPA.Auth.API.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "MPA.Auth.API.dll"]
