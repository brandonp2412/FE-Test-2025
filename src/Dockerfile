FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 3016

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY Test-API.Web/Test-API.Web.csproj Test-API.Web/
RUN dotnet restore "Test-API.Web/Test-API.Web.csproj"
COPY . .
WORKDIR "/src/Test-API.Web"
RUN dotnet publish "Test-API.Web.csproj" -c Release -o /app


FROM base AS final
WORKDIR /app
COPY --from=build /app .
ENTRYPOINT ["dotnet", "Test-API.Web.dll"]