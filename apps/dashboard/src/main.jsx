import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { store } from "./app/stores";
import { Provider } from "react-redux";

createRoot(document.getElementById("root")).render(
   <Provider store={store}>

  <BrowserRouter basename={import.meta.env.BASE_URL}>
    <App />
  </BrowserRouter>
   </Provider>
);
