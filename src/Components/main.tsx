import { useContext } from "react"
import { UserContext } from "../Context/loggedinUser"
import Navbar from "./navbar"

function MainPage (){
    const {user, displayname}= useContext(UserContext)
    return(
        <div id="main-content">
            <Navbar/>
        </div>
    )
}

export default MainPage