import './App.css';
import { Route, Routes } from 'react-router-dom';
import { UserContextProvider } from './UserContext';
import Layout from './Layout';
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreatePostPage from './pages/CreatePostPage';
import PostPage from './pages/PostPage';
import EditPostPage from './pages/EditPostPage';
import AccountPage from './pages/AccountPage';
import UserAccountPage from './pages/UserAccountPage';



function App() {
  return (
<UserContextProvider>
   <Routes>
    <Route path={'/'} element={<Layout />}>
      <Route index element={<IndexPage /> } />
      <Route path={'/login'} element={<LoginPage />} />
      <Route path={'/register'} element={<RegisterPage />} />
      <Route path={'/create'} element={<CreatePostPage />} />
      <Route path={'/post/:id'} element={<PostPage />} />
      <Route path={'/edit/:id'} element={<EditPostPage />} />
      <Route path={'/account'} element={<AccountPage />} />
      <Route path={'/user/:userId'} element={<UserAccountPage />} />
      <Route path="*" element={<Layout />} />
    </Route>
   </Routes>
</UserContextProvider>

   
  );
}

export default App;
