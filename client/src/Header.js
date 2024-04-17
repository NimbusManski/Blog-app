import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
import Menu from "./Menu";

export default function Header() {
  const [toggleMenu, setToggleMenu] = useState(false);
  const { setUserInfo, userInfo } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      fetch(`${process.env.REACT_APP_SERVER_URL}/profile`, {
        credentials: "include",
      }).then((response) => {
        response.json().then((userInfo) => {
          setUserInfo(userInfo);
          if (response.status === 401) {
            navigate("/login");
          }
        });
      });
    } catch (err) {
      if (err.response.status === 401) {
        alert("Session has expired");
        navigate("/login");
      }
    }
  }, []);

  const username = userInfo?.username;

  function toggleMenuHandler() {
    setToggleMenu(!toggleMenu);
  }

  return (
    <header>
      <Link to="/" className="logo">
        Casual Blog
      </Link>
      <nav>
        {username && (
          <>
            <Link to={"/account"}>{username}</Link>
            <Menu isOpen={toggleMenu} />
            <div className="open-menu" onClick={toggleMenuHandler}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </>
        )}

        {!username && (
          <>
            <Link to={"/login"}>Login</Link>
            <Link to={"/register"}>Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
