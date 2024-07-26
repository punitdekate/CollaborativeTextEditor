// public/script.js
const socket = io();
const editor = new Quill("#editor", {
  theme: "snow",
});

const documentId = "some-document-id"; // Replace with actual document ID
socket.emit("join", documentId);

editor.on("text-change", () => {
  const content = editor.getContents();
  socket.emit("edit", { documentId, content });
});

socket.on("document", (content) => {
  editor.setContents(content);
});
