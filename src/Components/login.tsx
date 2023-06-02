import { useContext, useState } from "react"
import { app } from "../firebaseConf"; 
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { UserContext } from "../Context/loggedinUser";
import { serverTimestamp } from "firebase/firestore";


function Login ({ onSwitchForm }:LoginProps){
    const [loginEmail, setLoginEmail] = useState<string>("");
    const [loginPass, setLoginPass] = useState<string>("");
    const [loginError, setLoginError] = useState<any>(null);
    const {setDisplayname, setUser} = useContext(UserContext)
    

    const handlelogin = async () =>{
        
        try {
            const userCredential = await signInWithEmailAndPassword(getAuth(app), loginEmail, loginPass);
            setDisplayname(userCredential.user.displayName)
            setUser(userCredential.user.email)
        }
        catch (error:any){
            if(error.code == "auth/user-not-found"){
                setLoginError("Email not registered!")
            }else if(error.code == "auth/wrong-password"){
                setLoginError("Wrong password!")
            }else if(error.code == "auth/internal-error"){
                setLoginError("Enter a password!")
            }else if(error.code == "auth/invalid-email"){
                setLoginError("Enter an email!")
            }else{
                setLoginError(error.code)
            }
            
        }
    }

    const handleSubmit = (event:any) =>{
        setLoginError(null)
        event.preventDefault();
        handlelogin();        
    }

    const demoLogin = async() =>{
        const userCredential = await signInWithEmailAndPassword(getAuth(app), "demo@demo.com", "Demo123");
        setDisplayname(userCredential.user.displayName)
        setUser(userCredential.user.email)
    }
    return(
        <div>
            <form id="login-form" onSubmit={handleSubmit}>
                <h1 className="form-h1">Welcome Back!</h1>
                <h2 className="form-h2">Sign in to your account</h2>
                <input type="email" name="lemail" id="lemail" required placeholder="Email" value={loginEmail} onChange={(e)=>setLoginEmail(e.target.value)} />
                <input type="password" name="lpsw" id="lpsw" required placeholder="Password" value={loginPass} onChange={(e)=>setLoginPass(e.target.value)}/>
                <button type="submit" id="lbtn">Sign In</button>
                {loginError && <p className="error-message">{loginError}</p>}
                <p className="form-text form-switch" onClick={onSwitchForm}>Don't have an account? Sign Up!</p>
                <p className="form-text demo" onClick={demoLogin}>Login with demo user!</p>
            </form>
        </div>
    )
}



export default Login