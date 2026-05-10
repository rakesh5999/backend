import { getFeed,createPost,likepost,unlikepost,deletepost,addcomment,getcomment,deletecomment, savePost, unsavePost, getSavedPosts } from "../services/post.api";
import { followUser, unFollowUser } from "../../follow/services/follow.api";
import { useContext  } from "react";
import { PostContext } from "../post.context";
import { useAuth } from "../../auth/hooks/useAuth";

export const usePost = ()=>{
    const context= useContext(PostContext)
    const { handleRefreshUser } = useAuth()

    const {loading,setloading,post,setpost,feed,setfeed, comments, setcomments, activePost, setactivePost} = context

    const handleGetFeed = async ()=>{

        setloading(true)
        const data= await getFeed()
        setfeed(data.posts)
        setloading(false)
 }

 const handleCreatePost = async (imageFile,caption)=>{
    setloading(true)
    const data = await createPost(imageFile,caption)
    setfeed([data.post, ...(feed || [])])
    setloading(false)
 }

 const handleLike=async (postId)=>{
    // Optimistic update
    setfeed(prevFeed => prevFeed.map(p => 
        p._id === postId ? { ...p, isLiked: true, likesCount: (p.likesCount || 0) + 1 } : p
    ))
    
    try {
        await likepost(postId)
    } catch (err) {
        console.error("Failed to like post", err)
        await handleGetFeed() // Revert on error
    }
 }

 const handleUnLike=async (postId)=>{
    // Optimistic update
    setfeed(prevFeed => prevFeed.map(p => 
        p._id === postId ? { ...p, isLiked: false, likesCount: Math.max(0, (p.likesCount || 0) - 1) } : p
    ))
    
    try {
        await unlikepost(postId)
    } catch (err) {
        console.error("Failed to unlike post", err)
        await handleGetFeed() // Revert on error
    }
 }

 const handleFollow = async (username) => {
    // Optimistic update for all posts by this user
    setfeed(prevFeed => prevFeed.map(p => 
        p.user?.username === username ? { ...p, followStatus: 'pending' } : p
    ))
    
    try {
        await followUser(username)
        await handleRefreshUser()
    } catch (err) {
        console.error("Failed to follow", err)
        await handleGetFeed()
    }
 }

 const handleUnFollow = async (username) => {
    // Optimistic update
    setfeed(prevFeed => prevFeed.map(p => 
        p.user?.username === username ? { ...p, followStatus: 'none' } : p
    ))
    
    try {
        await unFollowUser(username)
        await handleRefreshUser()
    } catch (err) {
        console.error("Failed to unfollow", err)
        await handleGetFeed()
    }
 }

 const handleSave = async (postId) => {
    // Optimistic update
    setfeed(prevFeed => prevFeed.map(p => 
        p._id === postId ? { ...p, isSaved: true } : p
    ))
    
    try {
        await savePost(postId)
    } catch (err) {
        console.error("Failed to save post", err)
        await handleGetFeed() // Revert
    }
 }

 const handleUnSave = async (postId) => {
    // Optimistic update
    setfeed(prevFeed => prevFeed.map(p => 
        p._id === postId ? { ...p, isSaved: false } : p
    ))
    
    try {
        await unsavePost(postId)
    } catch (err) {
        console.error("Failed to unsave post", err)
        await handleGetFeed() // Revert
    }
 }

 const handleGetSavedPosts = async () => {
    setloading(true)
    try {
        const data = await getSavedPosts()
        setfeed(data.posts)
    } catch (err) {
        console.error("Failed to fetch saved posts", err)
    } finally {
        setloading(false)
    }
 }


 const handleDelete = async (postId) => {
    // Optimistic update
    const previousFeed = [...feed]
    setfeed(prevFeed => prevFeed.filter(p => p._id !== postId))
    
    try {
        await deletepost(postId)
    } catch (err) {
        console.error("Failed to delete post", err)
        setfeed(previousFeed) // Revert on error
    }
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

    return {loading,post,feed,handleGetFeed,handleCreatePost,handleLike,handleUnLike,handleFollow,handleUnFollow,handleSave,handleUnSave,handleGetSavedPosts,handleDelete,handleToggleComments,handleAddComment,comments, activePost,handleDeleteComment}

}