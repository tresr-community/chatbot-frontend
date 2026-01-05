import type {APIRoute} from "astro";

export const prerender = false;

const handler: APIRoute = async ({locals, request}) => {
  console.debug(
    `[API/auth] POST from ${request.headers.get("Origin")} | method=${request.method}`
  );

  if (request.method !== "POST") {
    console.error("[API/auth] Non-POST, 405");
    return new Response("Method Not Allowed", {status: 405});
  }

  const env = locals.runtime.env as any;
  console.debug("[API/auth] env keys:", Object.keys(env || {}));

  const aiSecret = env.AI_SECRET;
  console.debug(`[API/auth] AI_SECRET available: ${!!aiSecret}`);
  if (!aiSecret) {
    console.error("[API/auth] MISSING AI_SECRET → 500");
    return new Response("Server config: missing AI_SECRET", {status: 500});
  }

  // Parse body.
  let json;
  try {
    json = await request.json();
    console.debug(`[API/auth] body parsed: keys=${Object.keys(json || {})}`);
  } catch (e) {
    console.error(`[API/auth] JSON parse fail: ${e} → 400`);
    return new Response("Invalid JSON", {status: 400});
  }
  const {chatbotAPIBase, message, version = "v1", backend} = json;
  console.debug(
    `[API/auth] parsed: API=${chatbotAPIBase}, msg_len=${message?.length}, v=${version}, b=${backend}`
  );

  if (
    typeof chatbotAPIBase !== "string" ||
    typeof message !== "string" ||
    !message.trim() ||
    !backend
  ) {
    console.error("[API/auth] invalid body → 400");
    return new Response("Missing chatbotAPI/message/backend", {status: 400});
  }

  // Disable TLS verification if set.
  const tlsVerify = env.TLS_VERIFY;
  if (tlsVerify === "false") {
    console.debug("TLS Verification is being disabled as TLS_VERIFY is false");
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  }

  // Target URL.
  const targetPath = `/ai/${version}/${backend}`;
  let targetUrl;
  try {
    targetUrl = new URL(targetPath, chatbotAPIBase);
    console.debug(`[API/auth] target: ${targetUrl.toString()}`);
  } catch (e) {
    console.error(`[API/auth] URL fail: ${e} → 400`);
    return new Response("Invalid target URL", {status: 400});
  }

  // Proxy fetch.
  // Create fresh headers to avoid CF-Ray loops/522s.
  const proxyHeaders = new Headers();
  proxyHeaders.set("Content-Type", "application/json");
  proxyHeaders.set("Authorization", `Bearer ${aiSecret}`);
  proxyHeaders.set(
    "Origin",
    request.headers.get("Origin") || new URL(chatbotAPIBase).origin
  );
  proxyHeaders.set(
    "User-Agent",
    request.headers.get("User-Agent") || "TresrChatbot/1.0"
  );

  const forwardBody = JSON.stringify({message: message.trim()});

  // Debug Log
  console.debug(`[API/auth] 🔍 PROXY DEBUG:`);
  console.debug(`[API/auth]   targetUrl: ${targetUrl.toString()}`);
  console.debug(
    `[API/auth]   headers:`,
    Object.fromEntries(proxyHeaders.entries())
  );

  const proxyInit: RequestInit = {
    method: "POST",
    headers: proxyHeaders,
    body: forwardBody,
  };

  let backendResponse;
  try {
    backendResponse = await fetch(targetUrl, proxyInit);
    console.debug(
      `[API/auth] fetch ${targetUrl}: status=${backendResponse.status}`
    );
  } catch (e) {
    console.error(`[API/auth] fetch fail: ${e} → 502`);
    return new Response(`Backend fetch failed: ${e}`, {status: 502});
  }

  const response = new Response(backendResponse.body, {
    status: backendResponse.status,
    headers: backendResponse.headers,
  });

  // CORS.
  const origin = request.headers.get("Origin") || "*";
  response.headers.append("Access-Control-Allow-Origin", origin);
  response.headers.append("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.append(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Origin"
  );

  console.debug(`[API/auth] proxy OK ${backendResponse.status}`);
  return response;
};

export {handler as POST};
export const OPTIONS = handler;
