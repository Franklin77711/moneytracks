import React from 'react';
import ReactDOM from 'react-dom/client';
import './Styles/index.scss';
import App from './App';
import { UserProvider } from './Context/loggedinUser';
import { TransactionProvider } from './Context/docSnaps';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <UserProvider>
      <TransactionProvider>
      <App />
      </TransactionProvider>
    </UserProvider>
  </React.StrictMode>
);
