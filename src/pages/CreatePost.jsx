import React from 'react'
import { useState} from 'react'
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Cookies from 'js-cookie';

const CreatePost = () => {
 const [posts, setPosts] = useState([]);
 const [isSubmitted, setIsSubmitted] = useState(false);
 const { userId } = useContext(AuthContext);


const onSubmit = (e) => {
    e.preventDefault();
    const title = e.target.elements.title.value;
    const content = e.target.elements.content.value;
    const post = { title, content, userId };
    setPosts([...posts, post]);

    const token = Cookies.get('token');
   

  
    axios.post('http://localhost:3001/posts', post, 
       {headers: { Authorization: `Bearer ${token}` }})
       .then(() => {
      console.log('Post sent: ', post);
      setIsSubmitted(true);
    });
    e.target.elements.title.value = '';
    e.target.elements.content.value = '';
    };

  
  return (
    <div>
    <div className='createPostPage'>
     <form onSubmit={onSubmit}>
            <label>Title:</label>
            <input type="text" placeholder="Title" name='title'/>
            <label>Content:</label>
            <input type="text" placeholder="Content" name='content'/>
            <button type="submit" >Submit</button>
     </form>
    </div>
    
    {isSubmitted && (
      <div>
        <h3>Post Submitted!</h3>
      </div>
    )}
    </div>
  )
}

export default CreatePost;