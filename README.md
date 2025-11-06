# Angular Log Viewer

A comprehensive request/response log viewer built with Angular and custom CSS (no Tailwind).

## Features

- 📋 View API request/response logs with detailed information
- 🔍 Search logs by ID, endpoint, method, or status
- 📊 Expandable parent/child operation hierarchy
- 🎯 Highlighted selection when logs are clicked or expanded
- 📝 JSON viewer for request/response bodies
- 🎨 Clean, modern UI with custom CSS
- 📱 Fully responsive design

## Prerequisites

Before running this project, make sure you have:

- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v20 or higher)

## Installation

1. Install Angular CLI globally (if not already installed):
\`\`\`bash
npm install -g @angular/cli
\`\`\`

2. Install project dependencies:
\`\`\`bash
npm install
\`\`\`

## Running the Application

Start the development server:

\`\`\`bash
ng serve
\`\`\`

Or use npm:

\`\`\`bash
npm start
\`\`\`

Navigate to `http://localhost:4200/` in your browser. The application will automatically reload if you change any source files.

## Building for Production

Build the project:

\`\`\`bash
ng build
\`\`\`

The build artifacts will be stored in the `dist/` directory.

## Project Structure

\`\`\`
src/
├── app/
│   ├── components/
│   │   ├── log-viewer/          # Main log viewer component
│   │   ├── log-modal/           # Detailed log modal
│   │   ├── json-modal/          # JSON viewer modal
│   │   └── json-viewer/         # JSON display component
│   ├── models/
│   │   └── log.model.ts         # TypeScript interfaces
│   ├── services/
│   │   └── log.service.ts       # Log data service
│   ├── app.component.ts
│   └── app.module.ts
├── styles.css                    # Global styles
└── index.html
\`\`\`

## Key Features Explained

### Highlighting
- Log entries are highlighted when clicked (modal open)
- Log entries remain highlighted when expanded (showing children)
- Child operations can also be clicked and highlighted

### Search
- Real-time search across ID, endpoint, method, and status
- Updates statistics dynamically

### Modals
- **Log Modal**: Shows detailed information with tabs (Overview, Request, Response)
- **JSON Modal**: Full-screen JSON viewer with copy functionality

## Technologies Used

- **Angular 20.3** - Modern web framework
- **RxJS 7.8** - Reactive programming
- **TypeScript 5** - Type-safe development
- **Custom CSS** - No framework dependencies (no Tailwind)

## Notes

⚠️ **Important**: This Angular project will NOT run in the v0 preview environment. v0 is designed for React/Next.js applications only.

To use this code:
1. Download the project files
2. Run `npm install` to install dependencies
3. Run `ng serve` to start the development server
4. Open `http://localhost:4200` in your browser

## License

MIT
