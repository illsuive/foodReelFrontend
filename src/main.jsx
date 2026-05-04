import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { store, persistor } from './store/store'; // Import both
import { Provider } from 'react-redux'
import axios from 'axios'
import { Toaster } from 'react-hot-toast';
import { PersistGate } from 'redux-persist/integration/react';

// Ensure cookies are sent and received with every API request
axios.defaults.withCredentials = true;

createRoot(document.getElementById('root')).render(
  <PersistGate loading={null} persistor={persistor}>
    <Provider store={store}>
        <App />
        <Toaster position="bottom-right" />
    </Provider>
  </PersistGate>
)
