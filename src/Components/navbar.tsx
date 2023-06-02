import { useContext, useState } from "react";
import { UserContext } from "../Context/loggedinUser";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../firebaseConf";
import exitsvg from "../media/exit.svg"

const Navbar: React.FC<NavbarProps> = ({ onTabChange }) => {
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

    const handleTabSwitch = (tab:string)=>{
        onTabChange(tab);
        handleNavSwitch();
    }

    return(
        <div>
            <div className={navOpen ? "overlay-nav-open":""} onClick={handleNavSwitch}></div>
            {navOpen ? <div id="navbar">
                
                <div id="navbar-element-container">
                    <div id="nav-dashboard" className="navbar-element" onClick={() => handleTabSwitch("dashboard")}>Dashboard</div>
                    <div id="nav-goals" className="navbar-element" onClick={() => handleTabSwitch("goals")}>Goals</div>
                    <div id="nav-history" className="navbar-element" onClick={() => handleTabSwitch("history")}>History</div>
                    <div id="nav-history" className="navbar-element" onClick={() => handleTabSwitch("exchange")}>Exchange Rates</div>
                    <div id="nav-settings" className="navbar-element" onClick={() => handleTabSwitch("settings")}>Settings</div>
                </div>
                <div id="navbar-logoff">
                    <div id="name">{displayname}</div>
                    <div id="user-logoff" onClick={handleSignOut}><img src={exitsvg} alt="exit" id="logoff-svg"/></div>
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