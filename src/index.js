import React from "react";
import ReactDOM from "react-dom/client"; // або 'react-dom'
import App from "./App";

const rootElement = document.getElementById("root"); // Перевірте цей елемент

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement); // Для React 18+
  root.render(<App />);
} else {
  console.error("Container element with id 'root' not found.");
}
