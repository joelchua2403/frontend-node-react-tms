
// import css
import '../App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import LoginPage from './LoginPage';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import Posts from '../components/Posts';
import GroupCard from '../components/GroupCard';
import Cookies from 'js-cookie';



function Home() {

const  [posts, setPosts] = useState([]);
const [isEditing, setIsEditing] = useState(false);
const [editPost, setEditPost] = useState({id:'', title:'', content:''});
const { isAuthenticated } = useContext(AuthContext);


useEffect(() => {
  if (isAuthenticated) {
    fetchPosts();
  }
}, []);

const fetchPosts = async () => {
  const token = Cookies.get('token');
  try {
    const response = await axios.get('http://localhost:3001/posts', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setPosts(response.data);
  } catch (error) {
    console.error(error);
  }
};
  
 

const onDelete = async (id) => {
  const token = Cookies.get('token');
  try {
    await axios.delete(`http://localhost:3001/posts/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setPosts(posts.filter(post => post.id !== id));
  } catch (error) {
    console.error('Error deleting post:', error);
  }
};

const onEdit = (post) => {
    setIsEditing(true);
    setEditPost(post);  
}

const handleEditChange = (e) => {
    const {name, value} = e.target; 
    setEditPost({...editPost, [name]: value});
}

const onEditSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:3001/posts/${editPost.id}`, editPost).then(() => {
        console.log('Post edited: ', editPost);
        setPosts(posts.map((post) => {
            return post.id === editPost.id ? editPost : post;
        }));
        setIsEditing(false);
    });
}

  return (
    <>
    <GroupCard />

</>
  );
  
}

export default Home;