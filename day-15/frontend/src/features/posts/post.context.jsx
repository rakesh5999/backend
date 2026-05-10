import { createContext , useState } from "react";

export const PostContext= createContext()

export const PostContextProvider =({children})=>{

    const [loading, setloading] = useState(false)
    const [post, setpost] = useState([])
    const [feed, setfeed] = useState([])
    const [userPosts, setuserPosts] = useState([])
    const [savedPosts, setsavedPosts] = useState([])
    const [comments, setcomments] = useState([])
    const [activePost, setactivePost] = useState(null)
    

   return(
     <PostContext.Provider value ={{loading,setloading,post,setpost,feed,setfeed,userPosts,setuserPosts,savedPosts,setsavedPosts,comments,setcomments,activePost,setactivePost}}> 
       {children}
    </PostContext.Provider>
   )
}
