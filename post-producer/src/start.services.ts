/** @format */

import KafkaConfig from "./config/kafka.config";

/**
 * Initializes the producer and creating the "post" topic.
 */
export const init = async (): Promise<void> => {
  try {
    await KafkaConfig.connect();
    await KafkaConfig.createTopic("post");
  } catch (error) {
    console.error("[❌ ERROR]: ", error);
    process.exit(1);
  }
};
