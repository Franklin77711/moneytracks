import { useContext, useEffect, useState } from "react"
import { UserContext } from "../Context/loggedinUser"
import Navbar from "./navbar"
import Dashboard from "./mainComponents/dashboard"
import History from "./mainComponents/history"
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
            {activeTab === 'history' && <History />}
            {activeTab === 'settings' && <Settings />}
        </div>
    )
}

export default MainPage