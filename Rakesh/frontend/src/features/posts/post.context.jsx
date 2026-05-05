import { createContext , useState } from "react";

export const PostContext= createContext()

export const PostContextProvider =({children})=>{

    const [loading, setloading] = useState(false)
    const [post, setpost] = useState(null)
    const [feed, setfeed] = useState(null)
    const [comments, setcomments] = useState([])      
    const [activePost, setactivePost] = useState(null)
    

   return(
     <PostContext.Provider value ={{loading,setloading,post,setpost,feed,setfeed,comments,setcomments,activePost,setactivePost}}> 
       {children}
    </PostContext.Provider>
   )
}
