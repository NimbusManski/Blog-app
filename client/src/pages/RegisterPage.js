import { useState } from "react";
import { Navigate } from "react-router-dom";

export default function RegisterPage() {
const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
const [redirect, setRedirect] = useState(false);
async function register(e) {
  e.preventDefault();
  const response = await fetch('http://localhost:8080/register', {
    method: 'POST',
    body: JSON.stringify({username, password}),
    headers: {'Content-Type':'application/json'},
    credentials: 'include',
  })
  if(response.status === 200) {
    alert('Registration successful! You can now login');
    setRedirect(true);
    
  } else {
    alert('Registration failed');
  }
}

if (redirect) {
  return (
  <Navigate to={'/login'} />
  )
  
 }

  return(
    <form className="register" onSubmit={register}>
      <h1>Register</h1>
      <input type='text' placeholder="username" value={username} onChange={(e) => {setUsername(e.target.value)}}  />
      <input type='password' placeholder="password" value={password} onChange={(e) => {setPassword(e.target.value)}}/>
      <button>Register</button>
    </form>

  )
}