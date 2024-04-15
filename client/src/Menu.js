import { useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from './UserContext';

export default function Menu({isOpen}) {
  const { setUserInfo, userInfo } = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/profile`, {
      credentials: 'include',
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
      });
    });
  }, [setUserInfo]);

  function logout() {
    fetch(`${process.env.REACT_APP_SERVER_URL}/logout`, {
      credentials: 'include',
      method: 'POST',
    });
    setUserInfo();

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