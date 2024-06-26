import { useState } from "react";
import axios from 'axios'
import { Navigate } from 'react-router-dom'
import "../assets/stylesheets/SignIn.css"


export default function SignUp(){

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [redirect, setRedirect] = useState(false);

    const axiosPostData = async() => {
        const postData = {
            email: email,
            password: password
        }

        axios.post('http://localhost:4000/signin', postData)
        .then((res) => {
            if(res.status == 200 && res.data?.res) {
                if(res.data.auth) 
                    setRedirect(true);
                else
                setError('Sign In Failed');
            } else {
                setError('Sign In Failed')
            }
            
    
        })

        
    }

    function handleSubmit(e){
        e.preventDefault();

        setError('')
        axiosPostData()
    }

    return(
        <div className="SigninContainer">
            <h1>Sign In</h1>
            { redirect && <Navigate to='/dashboard'/>}
            <form onSubmit={handleSubmit}>
                <label>Email</label><br />
                <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <br />
                <label>Password</label><br />
                <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <br />
                {error} <br />
                <button type="submit">Submit</button>
            </form>
        </div>
    )

}