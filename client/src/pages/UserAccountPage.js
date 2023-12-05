import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import Post from '../Post';

export default function UserAccountPage() {
  const { userId } = useParams(); 
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log(userId); 
        const response = await fetch(`http://localhost:8080/user/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        
        
      }
    };

    fetchUserData(); 

       
       const fetchUserPosts = async () => {
        try {
          const response = await fetch(`http://localhost:8080/user/${userId}/posts`);
          if (!response.ok) {
            throw new Error('Failed to fetch user posts');
          }
          const postsData = await response.json();
          setUserPosts(postsData);
        } catch (error) {
          console.error('Error fetching user posts:', error);
          
        }
      };
  
      fetchUserPosts(); 

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

      <h2>{user.username}'s Posts</h2>
      {userPosts.map((post) => (
        <Post key={post._id} {...post} />
      ))}
    </div>
  );
}