import { FastifyInstance, FastifyPluginOptions, FastifySchema } from "fastify";
import { countdownService } from "../services/CountdownService.js";

const errorResponse = {
  type: "object",
  properties: {
    success: { type: "boolean" },
    message: { type: "string" },
  },
};

const countdownSchema: FastifySchema = {
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        data: {
          type: "object",
          properties: {
            targetDate: { type: "string" },
            targetTimestamp: { type: "number" },
            message: { type: ["string", "null"] },
          },
        },
      },
    },
    default: errorResponse,
  },
};

export default async function apiRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify.get("/countdown", { schema: countdownSchema }, async (request, reply) => {
    return {
      success: true,
      data: countdownService.getCountDownData(),
    };
  });
}
