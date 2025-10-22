import http from "k6/http";
import { sleep } from "k6";

export const options = {
  vus: 1000,
  duration: "30s",
  cloud: {
    // Project: Default project
    projectID: 3717525,
    // Test runs with the same name groups test runs together.
    name: "Post-Producer",
  },
};

export default function () {
  const id = Math.random() * 99999;
  http.post(
    "http://localhost:3000/create-post",
    JSON.stringify({
      title: "Test " + id,
      content: "Test Content" + id,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  sleep(1);
}
