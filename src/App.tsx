import { useContext, useEffect, useState, useRef } from 'react';
import React from 'react';
import './Styles/App.scss';
import WelcomePage from './Components/welcome';
import MainPage from './Components/main';
import { UserContext } from './Context/loggedinUser';

function App() {
  const {user, setUser} = useContext(UserContext)
  const [welcomeRender, setWelcomeRender] = useState<boolean>(true)
  

  useEffect(() => {
    if (user == "" || user == null) {
      setWelcomeRender(true);   
    } else {
      setWelcomeRender(false);    
    }
  }, [user]);


  return (
    <div className="dark main">
      {welcomeRender ? <WelcomePage/>:<MainPage/>}
    </div>
  );
}

export default App;
