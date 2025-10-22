/** @format */

import db from "./config/db.config";
import kafkaConfig from "./config/kafka.config";
import { postConsumer } from "./services/post.consumer";

export const init = async () => {
  try {
    await db();
    await kafkaConfig.connect();
    await postConsumer();
  } catch (error) {
    console.error("[❌ ERROR]: ", error);
    process.exit(1);
  }
};
