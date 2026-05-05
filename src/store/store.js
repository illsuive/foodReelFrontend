import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './reducer/auth.js';
import foodReducer from './reducer/food.js';
import cartReducer from './reducer/cart.js';
import orderReducer from './reducer/order.js';

import { 
    persistStore, 
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';

const storage = {
    getItem: (key) => Promise.resolve(localStorage.getItem(key)),
    setItem: (key, value) => Promise.resolve(localStorage.setItem(key, value)),
    removeItem: (key) => Promise.resolve(localStorage.removeItem(key)),
};

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth'] 
};

const rootReducer = combineReducers({
  auth: authReducer,
  food: foodReducer,
  cart: cartReducer,
  order: orderReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4. Configure the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions to avoid console warnings
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// 5. Create the persistor
export const persistor = persistStore(store);