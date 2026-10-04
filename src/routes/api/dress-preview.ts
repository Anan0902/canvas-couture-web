import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { generateImage } from "@/lib/image-gateway.server";

export const Route = createFileRoute("/api/dress-preview")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const token = request.headers.get("Authorization")?.replace("Bearer ", "");
        if (!token) return new Response("Please sign in", { status: 401 });
        const sb = createClient(process.env["SUPABASE_URL"]!, process.env["SUPABASE_PUBLISHABLE_KEY"]!, { auth: { persistSession: false } });
        const { data: u } = await sb.auth.getUser(token);
        if (!u.user) return new Response("Please sign in", { status: 401 });
        const body = await request.json();
        const prompt = String(body.prompt ?? "").slice(0, 1500);
        if (!prompt) return new Response("Missing details", { status: 400 });
        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) return new Response("AI not configured", { status: 500 });
        const upstream = await generateImage(apiKey, prompt, body.stream !== false);
        return new Response(upstream.body, {
          status: upstream.status,
          headers: { "Content-Type": upstream.headers.get("Content-Type") ?? "application/json", "Cache-Control": "no-cache" },
        });
      },
    },
  },
});
