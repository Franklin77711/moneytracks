import { useContext, useEffect, useState } from "react"
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
    const {user, displayname, setUID}= useContext(UserContext);

    const [activeTab, setActiveTab] = useState<string>("dashboard")

    const handleTabChange = (tab:string)=>{
        setActiveTab(tab)
    }

    useEffect(()=>{
        const auth = getAuth(app);
        const user = auth.currentUser;
        if (user) {
            setUID(user.uid)
        }
    }, [])
    return(
        <div id="main-content">
            <Navbar onTabChange={handleTabChange}/>
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'goals' && <Goals />}
            {activeTab === 'history' && <History />}
            {activeTab === 'exchange' && <Exchange />}
            {activeTab === 'settings' && <Settings />}
        </div>
    )
}

export default MainPage