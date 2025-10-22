import http from "k6/http";
import { sleep } from "k6";

export const options = {
  vus: 1000,
  duration: "50s",
  cloud: {
    // Project: Default project
    projectID: 3717525,
    // Test runs with the same name groups test runs together.
    name: "Post-Producer",
  },
};

export default function () {
  http.get("https://api.letsxwork.com/docs", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  sleep(1);
}
