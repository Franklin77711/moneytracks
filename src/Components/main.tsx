import { useContext } from "react"
import { UserContext } from "../Context/loggedinUser"
import Navbar from "./navbar"

function MainPage (){
    const {user, displayname}= useContext(UserContext)
    return(
        <div id="main-content">
            <h1>Hello, {displayname}!</h1>
        </div>
    )
}

export default MainPage