/// <reference types="astro/client" />
/// <reference types="@astrojs/cloudflare" />

interface Env {
  TITLE: string;
  FOOTER_MESSAGE: string;
  WELCOME_MESSAGE: string;
  AI_VERSION: string;
  AI_BACKEND: string;
  ALLOWED_ORIGINS: string;
}

declare namespace App {
  interface Locals {
    runtime: {
      env: Env;
    };
  }
}
