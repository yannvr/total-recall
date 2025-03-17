# Total Recall

A powerful AI-powered multithread conversation engine tracker built with Quasar/Vue.js. This is the frontend application that works with the [ai-api](https://github.com/yannvr/ai-api) backend.

## Features

- Multi-threaded AI conversations with support for multiple providers
- Conversation management with tagging system
- Customizable chat interface
- Support for API key configuration
- Modern, responsive UI

## Project Roadmap

- ✅ Basic conversation management
- ✅ Chat interface
- ⚠️ Wrap Assistant web app in ChatWindow
- ⏳ Allow selection of engine (using server API key on trial basis)
- ⏳ Allow users to enter their own API keys
- ⏳ Enhanced tagging and search capabilities

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- [ai-api](https://github.com/yannvr/ai-api) backend server

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/total-recall.git
cd total-recall

# Install dependencies
yarn
# or
npm install
```

### Backend Setup

This frontend application requires the ai-api backend. To set up the backend:

```bash
# Clone the ai-api repository
git clone https://github.com/yannvr/ai-api.git
cd ai-api

# Install dependencies
bun install
# or
npm install

# Start the server
bun run server.ts
```

For more details about the backend API, refer to the [ai-api documentation](https://github.com/yannvr/ai-api).

### Environment Configuration

Create a `.env` file in the root directory with the necessary environment variables:

```
VITE_MOCK_API=0
```

Set `VITE_MOCK_API=1` to use mock data instead of real API calls during development.

## Development

### Start the app in development mode

```bash
quasar dev
# or
yarn dev
# or
npm run dev
```

This will start the development server with hot-code reloading, error reporting, etc.

### Lint the files

```bash
yarn lint
# or
npm run lint
```

### Format the files

```bash
yarn format
# or
npm run format
```

## Production

### Build the app for production

```bash
quasar build
# or
yarn build
# or
npm run build
```

## Project Structure

- `src/components/` - Reusable Vue components
- `src/pages/` - Application pages
- `src/stores/` - Pinia state management
- `src/layouts/` - Page layouts
- `src/router/` - Vue Router configuration
- `src/boot/` - Application initialization scripts

## Technology Stack

- [Quasar Framework](https://quasar.dev/) - Vue.js based framework
- [Vue.js 3](https://vuejs.org/) - Progressive JavaScript framework
- [Pinia](https://pinia.vuejs.org/) - State management
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Axios](https://axios-http.com/) - HTTP client

## Configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js) for detailed Quasar configuration options.
