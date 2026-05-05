import { getFeed,createPost,likepost,unlikepost,deletepost,addcomment,getcomment,deletecomment } from "../services/post.api";
import { useContext  } from "react";
import { PostContext } from "../post.context";

export const usePost = ()=>{
    const context= useContext(PostContext)

    const {loading,setloading,post,setpost,feed,setfeed, comments, setcomments, activePost, setactivePost} = context

    const handleGetFeed = async ()=>{

        setloading(true)
        const data= await getFeed()
        setfeed(data.posts.reverse())
        setloading(false)
 }

 const handleCreatePost = async (imageFile,caption)=>{
    setloading(true)
    const data = await createPost(imageFile,caption)
    setfeed([data.post, ...feed])
    setloading(false)
 }

 const handleLike=async (post)=>{
    const data=await likepost(post)
    await handleGetFeed()
 }

 const handleUnLike=async (post)=>{
    const data=await unlikepost(post)
    await handleGetFeed()
 }


 const handleDelete = async (post) => {
    const data = await deletepost(post)
    await handleGetFeed()
}

const handleToggleComments = async (postId) => {
    if (activePost === postId) {
        setactivePost(null)  // close if already open
        setcomments([])
    } else {
        setactivePost(postId)
        const data = await getcomment(postId)
        setcomments(data.comments)
    }
}

 const handleAddComment = async (postId, text) => {
    const data = await addcomment(postId, text)
    setcomments([...comments, data.comment])  // add to existing comments
}

const handleDeleteComment = async (commentId) => {
    await deletecomment(commentId)
    setcomments(comments.filter(c => c._id !== commentId))
}

    return {loading,post,feed,handleGetFeed,handleCreatePost,handleLike,handleUnLike,handleDelete,handleToggleComments,handleAddComment,comments, activePost,handleDeleteComment}

}