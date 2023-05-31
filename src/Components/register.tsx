function Register ({ onSwitchForm }:LoginProps){
    return(
        <div>
            <form action="" id="login-form">
                <h1 className="form-h1">Create an account</h1>
                <input type="name" name="lname" id="lname" placeholder="Name" />
                <input type="email" name="lemail" id="lemail" placeholder="Email" />
                <input type="password" name="lpsw" id="lpsw" placeholder="Password"/>
                <button type="submit" id="lbtn">Sign Up</button>
                <p className="form-text form-switch" onClick={onSwitchForm}>Already have an account? Sign In!</p>
            </form>
        </div>
    )
}



export default Register