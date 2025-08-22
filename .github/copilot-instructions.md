# Copilot Instructions - Memories and Miles

## Repository Overview

**Memories and Miles** is a .NET 8.0 Blazor WebAssembly travel planning website for Disney, Universal, and cruise vacations. Small repository (~15 files) using Blazorise 1.6.0 with Bootstrap5/FontAwesome. Three main pages: Home, Questionnaire, Contact. Deployed to GitHub Pages.

## Build & Validation

**ALWAYS run `dotnet restore` first.** No additional tools required (uses .NET 8.0).

```bash
dotnet restore              # Always run first
dotnet build               # Development build (~3-16 sec)
dotnet run                 # Dev server at http://localhost:5234
dotnet publish -c Release  # Production build
dotnet clean               # Clean all artifacts
```

**Known Issue:** Publish warns about missing `wasm-tools` workload - this is optional, application works correctly without it.

**No Tests or Linting:** Project has no test infrastructure or code quality tools configured.

## Project Layout & Architecture

### File Structure
```
├── .github/workflows/static.yml    # GitHub Pages deployment
├── memoriesandmiles.csproj         # .NET 8.0 project, Blazorise dependencies
├── Program.cs                      # App bootstrap, DI setup
├── App.razor                       # Router with MainLayout default
├── _Imports.razor                  # Global using statements  
├── Pages/Home.razor               # Welcome page (/)
├── Pages/Questionnaire.razor      # Destination picker (/questionnaire)
├── Pages/Contact.razor            # mailto: form (/contact)
├── Layout/MainLayout.razor        # ThemeProvider, navigation
├── Layout/NavMenu.razor           # Bootstrap navbar
├── wwwroot/index.html            # HTML shell, CSS/JS references
└── wwwroot/css/app.css           # Custom styling (#6fa7c7 blue theme)
```

### Key Dependencies
- **Blazorise 1.6.0** provides Bootstrap5-styled components (Card, Button, Field, etc.)
- **NavigationManager** used for email client integration
- **Router** handles page navigation with `@page` directives

### CI/CD
`.github/workflows/static.yml` uploads static files to GitHub Pages on main branch push (no build step).

### Making Changes
- **New pages:** Add .razor file in Pages/ with `@page "/route"`
- **Styling:** Edit wwwroot/css/app.css or Layout/MainLayout.razor theme  
- **Navigation:** Edit Layout/NavMenu.razor
- **Dependencies:** Modify memoriesandmiles.csproj, run `dotnet restore`

### Validation
1. `dotnet build` to verify compilation
2. `dotnet run` and test at http://localhost:5234
3. `dotnet publish -c Release` for production build

**Architecture Notes:** Client-side only, no database/server components. Contact form opens default mail client to laura@whitneyworldtravel.com. Questionnaire uses switch expressions for destination logic.

**Trust these instructions** - comprehensive and tested. Only search if incomplete or errors encountered.