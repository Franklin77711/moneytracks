import { useState } from "react"
import ThemePicker from "./themePicker"
import Login from "./login"
import Register from "./register"

function WelcomePage (){

    const [isLogin, setIsLogin] = useState<boolean>(true);

    const handleFormSwitch = () =>{
        setIsLogin(!isLogin);
    }
    return(
        <div id="welcome-page">
            <div id="welcome-group">
                <h1 id="welcome-text">PennyPal Wallet</h1>
                <div id="form">
                    {isLogin ? (<Login onSwitchForm={handleFormSwitch} />):(<Register onSwitchForm={handleFormSwitch} />)}
                </div>
            </div>
        </div>
    )
}

export default WelcomePage