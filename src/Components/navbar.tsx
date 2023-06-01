import { useContext, useState } from "react";
import { UserContext } from "../Context/loggedinUser";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../firebaseConf";

function Navbar () {
    const {user, displayname, setUser, setUID}= useContext(UserContext);
    const [navOpen, setNavOpen] = useState<boolean>(false)

    const handleSignOut = () =>{
        setUser("");
        setUID(null);
        signOut(getAuth(app))
    }

    const handleNavSwitch = ()=>{
        setNavOpen(!navOpen)
    }

    return(
        <div>
            {navOpen ? <div id="navbar">
                <div id="navbar-element-container">
                    <div id="nav-dashboard" className="navbar-element">Dashboard</div>
                    <div id="nav-goals" className="navbar-element">Goals</div>
                    <div id="nav-history" className="navbar-element">History</div>
                    <div id="nav-history" className="navbar-element">Exchange Rates</div>
                    <div id="nav-settings" className="navbar-element">Settings</div>
                </div>
                <div id="navbar-logoff">
                    <div id="name">{displayname}</div>
                    <div id="user-logoff" onClick={handleSignOut}>X</div>
                </div>
                <div id="nav-switch" onClick={handleNavSwitch}>X</div>
            </div>
            :
            <div id="nav-open" onClick={handleNavSwitch}><p>X</p></div>
            }
        </div>
    )
}

export default Navbar