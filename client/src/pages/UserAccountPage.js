import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Post from "../Post";

export default function UserAccountPage() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/user/${userId}`
        );
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userData = await userResponse.json();
        setUser(userData);

        const postsResponse = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/user/${userId}/posts`
        );
        if (!postsResponse.ok) {
          throw new Error("Failed to fetch user posts");
        }
        const postsData = await postsResponse.json();
        setUserPosts(postsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <div>
      {user ? (
        <div>
          <h1>{user.username}</h1>
        </div>
      ) : (
        <p>Loading...</p>
      )}

      <h2>{user && user.username}'s Posts</h2>
      {userPosts.map((post) => (
        <Post key={post._id} {...post} />
      ))}
    </div>
  );
}
