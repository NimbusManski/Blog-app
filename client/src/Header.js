import { Link, useNavigate,  } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { UserContext } from './UserContext';
import { authenticate, getToken } from './functions/utilFunctions';
import Menu from './Menu';

export default function Header() {
  const [toggleMenu, setToggleMenu] = useState(false);
  const { setUserInfo, userInfo } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {

    let token = getToken(document);

    if(!token){
      navigate('login');
      return
    }

    fetch('http://localhost:8080/profile', {
      credentials: 'include',
    }).then((response) => {
      if(response.status === 401){
        document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
        navigate('login');
      }
      response.json().then((userInfo) => {
        setUserInfo(userInfo);

        // NOTE: the below navigate handles the situation where a user tries to navigate to an undefined endpoint 
        // -> in this case the Layout component is rendered due to the catch all route in App which causes this useEffect to fire
        // -> this useEffect then tries to authenticate the user and if successful, navigates them to the home page, otherwise user gets 
        //    navigated to the sign in page 
        
        // COMBINATIONS AND RESULTS:
        // -> if user is logged in and then changes the url to localhost:3000/faosdifoeiwf for example, user will be re-authenticated using jwt and redirected to home page
        // -> if user is already authenticated (has a valid non-expired token) but does not have app open in browser, then if user searches localhost:3000/faosdifoeiwf, user 
        //    will be authenticated using jwt and redirected to home page
        // -> if user is signed out (no valid token) and tries to bypass the login page by searching localhost:3000/faosdifoeiwf, or even a valid route like http://localhost:3000/account, 
        //    user will be sent back to the login page 

        navigate('/');
      });
    });

    // ALTERNATE SYNTAX MAKIGN USE OF EXTERNAL FUNCTION FILE: 
    // (async () => {

    //   const [authenticated, userInfo] = await authenticate();

    //   if(!authenticated){
    //     navigate('login');
    //     return 
    //   }

    //   setUserInfo(userInfo);
    //   navigate('/')
    // })()

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

            <Link to={'/account'}>{username}</Link>
            <Menu isOpen={toggleMenu} />
            <div className='open-menu' onClick={toggleMenuHandler}>
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
            <Link to={'/login'}>Login</Link>
            <Link to={'/register'}>Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
