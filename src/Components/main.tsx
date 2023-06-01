import { useContext, useEffect } from "react"
import { UserContext } from "../Context/loggedinUser"
import Navbar from "./navbar"
import Dashboard from "./mainComponents/dashboard"
import Goals from "./mainComponents/goals"
import History from "./mainComponents/history"
import Exchange from "./mainComponents/exchange"
import Settings from "./mainComponents/settings"
import { getAuth } from 'firebase/auth';
import { app } from "../firebaseConf"

function MainPage (){
    const {user, displayname, setUID}= useContext(UserContext)

    useEffect(()=>{
        const auth = getAuth(app);
        const user = auth.currentUser;
        if (user) {
            setUID(user.uid)
        }
    }, [])
    return(
        <div id="main-content">
            <Navbar/>
            <Dashboard/>
        </div>
    )
}

export default MainPage