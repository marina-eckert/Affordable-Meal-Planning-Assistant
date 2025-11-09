FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY MPA.Gateway/MPA.Gateway.csproj MPA.Gateway/
RUN dotnet restore MPA.Gateway/MPA.Gateway.csproj

COPY . .

RUN dotnet publish MPA.Gateway/MPA.Gateway.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "MPA.Gateway.dll"]
