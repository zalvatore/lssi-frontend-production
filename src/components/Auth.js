import React, { useState } from 'react';
import { API } from '../api-services';
import Cookies from 'js-cookie';

function Authorized() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const loginClicked = () => {
    API.loginUser({username, password})
      .then( resp => {
        Cookies.set('token', resp.token, { expires: 7 });
        Cookies.set('user', username, { expires: 7 });
        window.location.reload(); // Refresh the page after setting cookies
      })
      .catch( error => console.log(error))
  }


  return (
    <div style={{ textAlign: "left" }}>
      <div className="login-container">
        <label htmlFor="username">Usario</label><br/>
        <input id="username" type="text" placeholder="Usario" value={username}
              onChange={ evt=> setUsername(evt.target.value)}
        /><br/>
        <label htmlFor="password">Contraseña</label><br/>
        <input id="password" type="password" placeholder="Contraseña" value={password}
            onChange={ evt=> setPassword(evt.target.value)} /><br/>
        <button onClick={loginClicked}>Login</button> 
      </div>
    </div>
    
  );
}

export default Authorized;
