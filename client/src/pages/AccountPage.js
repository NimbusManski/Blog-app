import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import Post from "../Post";

export default function AccountPage() {
  const { userInfo } = useContext(UserContext);
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        if (!userInfo.id) {
          return;
        }
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/user/${userInfo.id}/posts`
        );
        console.log("Fetching user posts from:", response);
        if (!response.ok) {
          throw new Error("Failed to fetch user posts");
        }
        const postsData = await response.json();
        setUserPosts(postsData);
      } catch (error) {
        console.error("Error fetching user posts:", error);
      }
    };
  
    fetchUserPosts();
  }, []);

  console.log(userInfo.id);

  if(userPosts.length === 0) {
    return (
      <div>
        <h1>{userInfo.username}</h1>
        <h2>My posts</h2>
        <p>No posts yet! <Link to={"/create"}>Add a post</Link></p>
      </div>
  )
  }

  return (
    <div>
      <h1>{userInfo.username}</h1>
      <h2>My Posts</h2>
      {userPosts.map((post) => (
        <Post key={post._id} {...post} currentUserId={userInfo.id} />
      ))}
    </div>
  );
}
