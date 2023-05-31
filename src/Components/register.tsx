import { useContext, useState } from "react"
import { app } from "../firebaseConf"; 
import { createUserWithEmailAndPassword , getAuth, updateProfile } from "firebase/auth";
import { UserContext } from "../Context/loggedinUser";


function Register ({ onSwitchForm }:LoginProps){

    const [regEmail, setRegEmail] = useState<string>("");
    const [regName, setRegName] = useState<string>("");
    const [regPass, setRegPass] = useState<string>("");
    const [regError, setRegError] = useState<any>(null);
    const {setUser, setDisplayname} = useContext(UserContext)
    

    const handleRegister = async () =>{
        
        try {
            const userCredential = await createUserWithEmailAndPassword (getAuth(app), regEmail, regPass);
            updateProfile(userCredential.user, {displayName: regName})
            setUser(userCredential.user.email)
            setDisplayname(regName)
            
        }
        catch (error:any){
            if(error.code == "auth/email-already-in-use"){
                setRegError("Email already registered!")
            }else if(error.code == "auth/weak-password"){
                setRegError("Password is too weak!")
            }else if(error.code == "auth/internal-error"){
                setRegError("Enter a password!")
            }else if(error.code == "auth/invalid-email"){
                setRegError("Enter an email!")
            }else{
                setRegError(error.code)
            }
            
        }
    }

    const handleSubmit = (event:any) =>{
        setRegError(null)
        event.preventDefault();
        handleRegister();        
    }

    return(
        <div>
            <form action="" id="login-form" onSubmit={handleSubmit}>
                <h1 className="form-h1">Create an account</h1>
                <input type="name" name="lname" id="lname" placeholder="Name" value={regName} onChange={(e)=>{setRegName(e.target.value)}}/>
                <input type="email" name="lemail" id="lemail" required placeholder="Email" value={regEmail} onChange={(e)=>{setRegEmail(e.target.value)}}/>
                <input type="password" name="lpsw" id="lpsw" required placeholder="Password" value={regPass} onChange={(e)=>{setRegPass(e.target.value)}}/>
                <button type="submit" id="lbtn">Sign Up</button>
                {regError && <p className="error-message">{regError}</p>}
                <p className="form-text form-switch" onClick={onSwitchForm}>Already have an account? Sign In!</p>
            </form>
        </div>
    )
}



export default Register