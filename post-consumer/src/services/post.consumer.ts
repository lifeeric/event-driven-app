/** @format */

import kafkaConfig from "../config/kafka.config";
import PostModel from "../model/posts";

export const postConsumer = async () => {
  console.log("[post consumer]");
  const messages: string[] = [];
  let processing = false;

  try {
    await kafkaConfig.subscribeToTopic("post");

    await kafkaConfig.consume(async (message) => {
      messages.push(message);

      // Bulk insertion into DB
      // if one user send message, it will hang here unless 99 more messages are received
      if (messages.length > 100) {
        processMessages();
      }
    });

    // so we can process messages every 5 seconds
    setInterval(processMessages, 5000);
  } catch (error) {
    console.error("[❌ ERROR]: ", error);
  }
  async function processMessages() {
    if (messages?.length > 0 && !processing) {
      processing = true;
      const batchToPoccess = [...messages];
      messages.length = 0;

      try {
        await PostModel.insertMany(batchToPoccess, { ordered: true });
        console.log("[✅] Bulk insertion completed!");
      } catch (error) {
        console.error("[❌ ERROR]: ", error);
      } finally {
        processing = false;
      }
    }
  }
};
