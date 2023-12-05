import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';

let toolbarOptions =  [ 
    [{ 'font': [] }],
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
   
  
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
   
    [{ 'align': [] }],

    ['link', 'image']
]

  const module = {
    toolbar: toolbarOptions,
  }

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect, setRedirect] = useState(false);
 async function createNewPost(e) {
    e.preventDefault();
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('file', files[0]);
   const response = await fetch('http://localhost:8080/post', {
      method: 'POST',
      body: data,
      credentials: 'include',
    });

    if(response.ok) {
      setRedirect(true);
    }

  };

  if (redirect) {
    return <Navigate to={'/'} />
  }

  return(
   <form onSubmit={createNewPost} >
    <input type='title' placeholder={"Title"} value={title} onChange={e => {setTitle(e.target.value)}} />
    <input type='summary' placeholder={"Summary"} value={summary} onChange={e => {setSummary(e.target.value)}} /> 
    <input type="file" onChange={e => {setFiles(e.target.files)}} />
   <ReactQuill theme='snow' modules={module} value={content} onChange={value => {setContent(value)}} />
   <button style={{marginTop: '5px'}}>Create post</button>
   </form>
  )
}