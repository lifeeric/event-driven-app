/** @format */

import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

// Lib
import kafkaConfig from "../config/kafka.config";

const app = new Hono();

app.post(
  "/create-post",
  zValidator("json", z.object({ title: z.string(), content: z.string() })),
  async (c) => {
    const { title, content } = c.req.valid("json");

    try {
      await kafkaConfig.sendToTopic("post", JSON.stringify({ title, content }));
      return c.json({ message: "Post created successfully!" }, 201);
    } catch (error) {
      console.error("[❌ ERROR]: ", error);
      return c.json(
        {
          message: "Internal Server Error",
        },
        500
      );
    }
  }
);

export default app;
