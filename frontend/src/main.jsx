import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
// import { Provider } from "react-redux";
// import store from "./redux/store"; // ✅ Ensure correct import
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
    // <Provider > {/* ✅ Corrected   store={store}*/}
        <BrowserRouter> {/* ✅ Only one BrowserRouter */}
            <App />
        </BrowserRouter>
    // </Provider>
);
