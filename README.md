# ChatBot Frontend

The Astro frontend for the ChatBot.

This repository contains the source files for the Ron Jay [ChatBot](https://chat.nftreasure.community)

This is an unofficial chatbot for the NFTREASURE Community and is not affiliated with the NFTREASURE project.

It is made with :heart: _love_ :heart: for the NFTREASURE Community.

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

## How to test locally

There are a few URLs that you can use to test the chatbot locally depending on the worker.

### Caddy

The caddy server is used to proxy the chatbot requests to the correct worker.

Access Caddy at: [https://localhost:9000](https://localhost:9000)

### Frontend

The frontend worker is the main entry point for the chatbot. It is responsible for rendering the chatbot UI using Astro.

Access to the Frontend Worker is via Caddy at: [https://localhost:9000](https://localhost:9000) -> [http://localhost:9100](http://localhost:9100)

The frontend worker embeds the UI Widget worker on he main page behind a button.

### Backend

The backend worker is managed in a separate repository and is responsible for handling the chatbot API requests and responses.

The source code for the backend worker can be found [here](https://github.com/NFTREASURE-Community/chatbot-backend).

Once you have the chatbot backend running, access to the Worker is via Caddy at: [https://localhost:9000/api](https://localhost:9000/api) -> [http://localhost:9200](http://localhost:9200)
