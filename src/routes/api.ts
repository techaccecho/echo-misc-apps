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
<<<<<<< HEAD
            redirectUrl: { type: ["string", "null"] },
=======
>>>>>>> a11ce0b1530d646d050b506c4c4da07cb56a3bd6
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
<<<<<<< HEAD
                    currentMessage: { type: "string" },
                    currentSubtext: { type: "string" },
                    itKnows: { type: "string" },
=======
                    sealBroken: { type: "string" },
                    somethingComing: { type: "string" },
                    itKnows: { type: "string" },
                    defaultMessage: { type: "string" },
                    defaultSubtext: { type: "string" },
                    currentMessage: { type: "string" },
                    currentSubtext: { type: "string" },
>>>>>>> a11ce0b1530d646d050b506c4c4da07cb56a3bd6
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
