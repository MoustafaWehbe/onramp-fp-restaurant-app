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
  const event = JSON.parse(data.toString());
  console.log("📩", event);
  if (event.type === "completed" || event.type === "error") {
    ws.close();
  }
});

ws.on("close", () => {
  console.log("❌ WebSocket closed");
});

ws.on("error", (error) => {
  console.error("❌ WebSocket error:", error.message);
});
