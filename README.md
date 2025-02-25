# Chat Bot Frontend

This repository contains the source files for the Ron Jay [chatbot](https://chat.tresr.community) frontend.

This is an unofficial chatbot for the tresr community and is not affiliated with the tresr project.

It is made with :heart: _love_ :heart: for the tresr community.

## How to run locally

```bash
# Build
bun run build

# Preview (Frontend only)
bun run preview

# Or,

# Preview (Frontend and Backend via Caddy)
#   1. Make sure the backend is running in one terminal.
#   2. Start the Worker in another terminal
bun run preview
#   3. Start Caddy in another terminal
./scripts/caddy start
#   4. Stop Caddy when done
./scripts/caddy stop
```

## How to update locally

```bash
# Update the frontend
bun run update
```

## How to test locally

There are a few URLs that you can use to test the chatbot locally depending on the worker.

### Caddy

Caddy Server can be used to proxy the chatbot requests to the correct worker.

One you have started the script from this repository, access Caddy at: [https://localhost:9000](https://localhost:9000)

### Frontend

The frontend worker is the main entry point for the chatbot. It is responsible for rendering the chatbot UI using Astro.

Access to the Frontend Worker is via Caddy at: [https://localhost:9000](https://localhost:9000) -> [http://localhost:9100](http://localhost:9100)

The frontend worker embeds the UI Widget worker on the main page behind a button or offers a fullscreen page at /fullscreen.

### Backend

The backend worker is managed in a separate repository and is responsible for handling the chatbot API requests and responses.

The source code for the backend worker can be found [here](https://github.com/tresr-community/chatbot-backend).

Once you have the chatbot backend running, access to the Worker is via Caddy at: [https://localhost:9000/api](https://localhost:9000/api) -> [http://localhost:9200](http://localhost:9200)
