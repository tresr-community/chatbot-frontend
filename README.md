# Chat Bot Frontend

This repository contains the source files for the Ron Jay [chatbot](https://chat.tresr.community) frontend.

This is an unofficial chatbot for the tresr community and is not affiliated with the tresr project.

It is made with :heart: _love_ :heart: for the tresr community.

## How to run locally

- Enter the development shell

```bash
devenv shell
```

- Run the helper script

```bash
chatbot-frontend start
```

## How to update dependencies

```bash
chatbot-frontend update
```

## How to test locally

There are a few URLs that you can use to test the chatbot locally depending on the worker.

### Caddy

Caddy Server can be used to proxy the chatbot requests to the correct worker.

One you have started the script from this repository, access Caddy at: [https://localhost:9000](https://localhost:9000)

- [Chat Widget](https://localhost:9000)
- [Chat Fullscreen](https://localhost:9000/fullscreen)

### Frontend

The frontend worker is the main entry point for the chatbot. It is responsible for rendering the chatbot UI using Astro.

Access to the Frontend Worker is via Caddy at: [https://localhost:9000](https://localhost:9000) -> [http://localhost:9100](http://localhost:9100)

The frontend worker embeds the UI Widget worker on the main page behind a button or offers a fullscreen page at /fullscreen.

### Backend

The backend worker is managed in a separate repository and is responsible for handling the chatbot API requests and responses.

The source code for the backend worker can be found [chatbot-backend repository](https://github.com/tresr-community/chatbot-backend).

Once you have the chatbot backend running, access to the Worker is via Caddy at: [https://localhost:9000/api](https://localhost:9000/api) -> [http://localhost:9200](http://localhost:9200)
