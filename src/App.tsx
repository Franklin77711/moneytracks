import { useState } from 'react';
import React from 'react';
import './Styles/App.scss';
import WelcomePage from './Components/welcome';
import MainPage from './Components/main';

function App() {
  const [welcomeRender, setWelcomeRender] = useState<boolean>(true)
  return (
    <div className="dark main">
      {welcomeRender ? <WelcomePage/>:<MainPage/>}
    </div>
  );
}

export default App;
