import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

// Baca data dari file JSON
const schedulesData = JSON.parse(
  await Deno.readTextFile("./data/schedules.json"),
);

const router = new Router();
router
  .get("/", (context) => {
    context.response.body = "JTK25 Jadwal API";
  })
  .get("/api/version", (context) => context.response.body = 1)
  .get("/api/schedules", (context) => {
    context.response.body = schedulesData;
  });

const app = new Application();
app.use(oakCors()); // Enable CORS for all routes
app.use(router.routes());
app.use(router.allowedMethods());

console.log("Server running on http://localhost:8000");
await app.listen({ port: 8000 });
