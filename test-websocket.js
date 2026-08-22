const WebSocket = require("ws");

const ws = new WebSocket("ws://localhost:3000/ws/ask");

ws.on("open", () => {
  console.log("✅ WebSocket connected");

 ws.send(
  JSON.stringify({
    type: "ask",
    question: "What restaurants are available in Hamra?",
  })
);
});

ws.on("message", (data) => {
  console.log("📩", data.toString());
});

ws.on("close", () => {
  console.log("❌ WebSocket closed");
});

ws.on("error", (error) => {
  console.error("❌ WebSocket error:", error.message);
});
