import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";

export default function EditPostPage() {
  const {id} = useParams();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/post/`+ id)
    .then(response => {
      response.json().then(postInfo => {
        setTitle(postInfo.title);
        setContent(postInfo.content);
        setSummary(postInfo.summary);
      })
    })
  }, []);

 async function updatePost(e) {
    e.preventDefault();
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('id', id);
    if (files?.[0]) {
      data.set('file', files?.[0]);
    }

  const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/post`, {
      method: "PUT",
      body: data,
      credentials: 'include',
    });

    if (response.ok) {
      setRedirect(true);
    }
    
    
  }

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

  if (redirect) {
    return <Navigate to={'/post/' + id} />
  }

  return(
    <form onSubmit={updatePost} >
    <input type='title' placeholder={"Title"} value={title} onChange={e => {setTitle(e.target.value)}} />
    <input type='summary' placeholder={"Summary"} value={summary} onChange={e => {setSummary(e.target.value)}} /> 
    <input type="file" onChange={e => {setFiles(e.target.files)}} />
   <ReactQuill theme='snow' modules={module} value={content} onChange={value => {setContent(value)}} />
   <button style={{marginTop: '5px'}}>Update post</button>
   </form>
  )
};