import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

// Daftar file jadwal per kelas
const scheduleFiles = [
  "./data/schedules_1A_D4.json",
  "./data/schedules_1B_D4.json",
  "./data/schedules_1C_D4.json",
  "./data/schedules_1D_D4.json",
  "./data/schedules_1A_D3.json",
  "./data/schedules_1B_D3.json",
];

// Baca semua file jadwal dan gabungkan
const loadSchedules = async () => {
  const classes = await Promise.all(
    scheduleFiles.map(async (file) => {
      const data = JSON.parse(await Deno.readTextFile(file));
      return {
        class_name: data.class_name,
        schedule: data.schedule,
      };
    }),
  );

  // Ambil metadata dari file pertama
  const firstFile = JSON.parse(await Deno.readTextFile(scheduleFiles[0]));

  return {
    academic_year: firstFile.academic_year,
    semester: firstFile.semester,
    curriculum: firstFile.curriculum,
    classes,
  };
};

const schedulesData = await loadSchedules();

const router = new Router();
router
  .get("/", (context) => {
    context.response.body = "JTK25 Jadwal API";
  })
  .get("/download/:version", async (context) => {
    const version = context.params.version.replace(".apk", "");
    if (!/^\d+(\.\d+)?$/.test(version)) {
      context.response.status = 400;
      context.response.body = "Invalid version format. Must be a float value.";
      return;
    }
    return context.response.body = await Deno.readFile(
      `./builds/${version}.apk`,
    );
  })
  .get("/api/version", (context) => context.response.body = 1.1)
  .get("/api/schedules", (context) => {
    context.response.body = schedulesData;
  });

const app = new Application();
app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

console.log("Server running on http://localhost:8000");
await app.listen({ port: 8000 });
