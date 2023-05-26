function Login (){
    return(
        <div >
            <form action="" id="login-form">
                <h1 className="form-h1">Welcome Back!</h1>
                <h2 className="form-h2">Sign in to your account</h2>
                <input type="email" name="lemail" id="lemail" placeholder="Email" />
                <input type="password" name="lpsw" id="lpsw" placeholder="Password"/>
                <button type="submit" id="lbtn">Sign In</button>
                <p className="form-text">Don't have an account? Create Here!</p>
                <p className="form-text demo">Login with demo user!</p>
            </form>
        </div>
    )
}



export default Login