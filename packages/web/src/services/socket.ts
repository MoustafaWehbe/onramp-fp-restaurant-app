let socket: WebSocket | null = null;

function getWebSocketUrl() {
  const protocol =
    window.location.protocol === "https:" ? "wss:" : "ws:";

  return `${protocol}//${window.location.host}/ws/ask`;
}

export function getSocket() {
  if (
    !socket ||
    socket.readyState === WebSocket.CLOSED ||
    socket.readyState === WebSocket.CLOSING
  ) {
    socket = new WebSocket(getWebSocketUrl());

    socket.onopen = () => {
      console.log("AI socket connected");
    };

    socket.onclose = () => {
      console.log("AI socket closed");
    };

    socket.onerror = (error) => {
      console.error("AI socket error", error);
    };
  }

  return socket;
}