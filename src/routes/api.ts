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
            redirectUrl: { type: ["string", "null"] },
            status: {
              type: "object",
              properties: {
                difference: { type: "number" },
                isReached: { type: "boolean" },
                isUnstable: { type: "boolean" },
                time: {
                  type: ["object", "null"],
                  properties: {
                    days: { type: "number" },
                    hours: { type: "number" },
                    minutes: { type: "number" },
                    seconds: { type: "number" },
                    formatted: { type: "string" },
                  },
                },
                messages: {
                  type: "object",
                  properties: {
                    currentMessage: { type: "string" },
                    currentSubtext: { type: "string" },
                    itKnows: { type: "string" },
                  },
                },
              },
            },
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
