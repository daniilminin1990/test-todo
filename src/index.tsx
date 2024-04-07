import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './app/App';
import reportWebVitals from './reportWebVitals';
import {Provider} from "react-redux";
import {store} from "./store/store";
import {HashRouter} from "react-router-dom";
import {ThemeTogglerHOC} from "./components/ThemeTogglerHOC";
import AppBarWithToggleLeft from "./components/AppBarWithToggle";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <HashRouter>
      <ThemeTogglerHOC>
        <AppBarWithToggleLeft>
          <App/>
        </AppBarWithToggleLeft>
      </ThemeTogglerHOC>
    </HashRouter>
  </Provider>
  // {/* </React.StrictMode> */}
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
