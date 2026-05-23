import Fastify from "fastify";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyStatic from "@fastify/static";
import apiRoutes from "./routes/api.js";
import { countdownService } from "./services/CountdownService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify({
  logger: true,
});

// Register Swagger
await fastify.register(fastifySwagger, {
  swagger: {
    info: {
      title: "Echo Backend API",
      description: "API documentation for Echo Backend",
      version: "1.0.0",
    },
    host: "localhost:3000",
    schemes: ["http"],
    consumes: ["application/json"],
    produces: ["application/json"],
  },
});

await fastify.register(fastifySwaggerUi, {
  routePrefix: "/api-docs",
  uiConfig: {
    docExpansion: "full",
    deepLinking: false,
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
});

// Serve assets
await fastify.register(fastifyStatic, {
  root: path.join(__dirname, "fe"),
  prefix: "/fe/",
});

await fastify.register(fastifyStatic, {
  root: path.join(__dirname, "fe/assets"),
  prefix: "/assets/",
  decorateReply: false,
});

fastify.get("/countdown", async (request, reply) => {
  try {
    const filePath = path.join(__dirname, ".", "fe/count-down/countdown.html");
    let content = fs.readFileSync(filePath, "utf8");
    
    // Inject target timestamp and initial state from backend
    const targetTimestamp = countdownService.getTargetTimestamp();
    const initialState = JSON.stringify(countdownService.getCountDownData());
    
    // Ensure the marker exists before replacing
    if (!content.includes("/* BACKEND_TARGET_TIMESTAMP */")) {
      throw new Error("Backend target timestamp marker not found in HTML template");
    }

    content = content.replace(
      "/* BACKEND_TARGET_TIMESTAMP */",
      `const backendTargetTimestamp = ${targetTimestamp};
<<<<<<< HEAD
       const backendInitialState = ${initialState.replace(/</g, "\\u003c")};`
=======
       const backendInitialState = ${initialState};`
>>>>>>> a11ce0b1530d646d050b506c4c4da07cb56a3bd6
    );

    reply.type("text/html").send(content);
  } catch (err) {
    fastify.log.error(err);
    const errorFilePath = path.join(__dirname, ".", "fe/count-down/countdown-error.html");
    try {
      const errorContent = fs.readFileSync(errorFilePath, "utf8");
      return reply.status(500).type("text/html").send(errorContent);
    } catch (readErr) {
      // Fallback to generic error if custom error page also fails
      return reply.status(500).send("Critical System Failure");
    }
  }
});


// Register API routes
fastify.register(apiRoutes, { prefix: "/v1/api" });

// Handle 404
fastify.setNotFoundHandler(async (request, reply) => {
  // For API routes, return JSON
  if (request.url.startsWith("/v1/api")) {
    reply.status(404).send({
      message: `Route ${request.method}:${request.url} not found`,
      error: "Not Found",
      statusCode: 404
    });
    return;
  }

  const errorPath = path.join(__dirname, ".", "fe/count-down/countdown-error.html");
  try {
    const errorContent = fs.readFileSync(errorPath, "utf8");
    reply.status(404).type("text/html").send(errorContent);
  } catch (err) {
    reply.status(404).send("Not Found");
  }
});

// Handle global errors
fastify.setErrorHandler(async (error: any, request, reply) => {
  fastify.log.error(error);

  // For API routes, return JSON
  if (request.url.startsWith("/v1/api")) {
    reply.status(error.statusCode || 500).send({
      message: error.message,
      error: error.name,
      statusCode: error.statusCode || 500
    });
    return;
  }

  const errorPath = path.join(__dirname, ".", "fe/count-down/countdown-error.html");
  try {
    const errorContent = fs.readFileSync(errorPath, "utf8");
    reply.status(error.statusCode || 500).type("text/html").send(errorContent);
  } catch (err) {
    reply.status(error.statusCode || 500).send("Critical System Failure");
  }
});

// Start the server
const start = async () => {
  try {
    const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
    await fastify.listen({ port, host: "0.0.0.0" });
    console.log(`Server listening on http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
