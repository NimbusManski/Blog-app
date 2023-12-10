import { useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from './UserContext';

export default function Menu({isOpen}) {
  const { setUserInfo, userInfo } = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8080/profile', {
      credentials: 'include',
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  function logout() {
    fetch('http://localhost:8080/logout', {
      credentials: 'include',
      method: 'POST',
    });
    setUserInfo(null);
    document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
    navigate('login');
  }

  const username = userInfo?.username;

  

  return(
    <div className={`menu-box ${isOpen ? 'open-menu' : ''}`}>
      <ul>
        <Link className="menu-item" to={'/create'}>Add post </Link>
        <a className="menu-item" href="" onClick={logout} >Logout  </a>
        <Link to={"/account"}>My Account</Link>
      </ul>
    </div>
  )
}