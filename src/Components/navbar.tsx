import { useContext } from "react"
import { UserContext } from "../Context/loggedinUser"

function Navbar () {
    const {user, displayname}= useContext(UserContext)
    return(
        <div id="navbar">
            <div id="navbar-element-container">
                <div id="dashboard" className="navbar-element">Dashboard</div>
                <div id="history" className="navbar-element">History</div>
                <div id="history" className="navbar-element">Exchange Rates</div>
                <div id="settings" className="navbar-element">Settings</div>
            </div>
            <div id="navbar-logoff">
                <div id="name">{displayname}</div>
                <div id="user-logoff">X</div>
            </div>
            <div id="nav-switch">X</div>
        </div>
    )
}

export default Navbar