import { useEffect, useState, useContext } from "react";
import Post from "../Post";
import { UserContext } from "../UserContext";

export default function IndexPage() {
  const { userInfo } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    if(!userInfo){
      return 
    }
    fetch('http://localhost:8080/post').then(response => {
      response.json().then(posts => {
        setPosts(posts);

      })
    })
  }, [userInfo])

  // console.log(userInfo.id);

  return (
    <>
      {posts.length > 0 && posts.map(post => (
        <Post key={post._id} {...post}
          currentUserId={userInfo.id}
        />
      ))}
    </>
  )
}