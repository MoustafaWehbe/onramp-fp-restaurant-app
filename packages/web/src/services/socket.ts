let socket: WebSocket | null = null;

export function getSocket() {
  if (
    !socket ||
    socket.readyState === WebSocket.CLOSED ||
    socket.readyState === WebSocket.CLOSING
  ) {
    socket = new WebSocket(
      "ws://localhost:3000/ws/ask"
    );

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