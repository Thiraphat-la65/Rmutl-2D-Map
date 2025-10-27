import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from 'react-redux'; // Import Provider จาก react-redux
import { store } from './store/store'; // Import store ที่สร้างไว้

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}> {/* ห่อหุ้ม App ด้วย Provider */}
      <App />
    </Provider>
  </React.StrictMode>
);