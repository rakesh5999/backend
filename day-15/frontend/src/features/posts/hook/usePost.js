import { getFeed,createPost,likepost,unlikepost,deletepost,addcomment,getcomment,deletecomment, savePost, unsavePost, getSavedPosts, getUserPosts } from "../services/post.api";
import { followUser, unFollowUser } from "../../follow/services/follow.api";
import { useContext  } from "react";
import { PostContext } from "../post.context";
import { useAuth } from "../../auth/hooks/useAuth";
import { FollowContext } from "../../follow/follow.context";

export const usePost = ()=>{
    const context= useContext(PostContext)
    const { handleRefreshUser } = useAuth()

    const {loading,setloading,post,setpost,feed,setfeed, userPosts, setuserPosts, savedPosts, setsavedPosts, comments, setcomments, activePost, setactivePost} = context
    const followContext = useContext(FollowContext)

    const handleGetFeed = async () => {
        if (!feed || feed.length === 0) setloading(true)
        try {
            const data = await getFeed()
            setfeed(data.posts)
        } catch (err) {
            console.error("Failed to load feed", err)
        } finally {
            setloading(false)
        }
    }

    const handleGetUserPosts = async (username) => {
        if (!userPosts || userPosts.length === 0) setloading(true)
        try {
            const data = await getUserPosts(username)
            setuserPosts(data.posts)
        } catch (err) {
            console.error("Failed to fetch user posts", err)
        } finally {
            setloading(false)
        }
    }

 const handleCreatePost = async (imageFile,caption)=>{
    setloading(true)
    const data = await createPost(imageFile,caption)
    setfeed([data.post, ...(feed || [])])
    setloading(false)
 }

    const handleLike = async (postId) => {
        const updater = (prev) => prev.map(p => 
            p._id === postId ? { ...p, isLiked: true, likesCount: (p.likesCount || 0) + 1 } : p
        )
        setfeed(updater)
        setuserPosts(updater)
        setsavedPosts(updater)
        
        try {
            await likepost(postId)
        } catch (err) {
            console.error("Failed to like post", err)
            handleGetFeed()
        }
    }

    const handleUnLike = async (postId) => {
        const updater = (prev) => prev.map(p => 
            p._id === postId ? { ...p, isLiked: false, likesCount: Math.max(0, (p.likesCount || 0) - 1) } : p
        )
        setfeed(updater)
        setuserPosts(updater)
        setsavedPosts(updater)
        
        try {
            await unlikepost(postId)
        } catch (err) {
            console.error("Failed to unlike post", err)
            handleGetFeed()
        }
    }

    const handleFollow = async (username) => {
        const updater = (prev) => prev.map(p => 
            p.user?.username === username ? { ...p, followStatus: 'pending' } : p
        )
        setfeed(updater)
        setuserPosts(updater)
        setsavedPosts(updater)
        
        if (followContext?.setUsers) {
            followContext.setUsers(prev => prev.map(u => 
                u.username === username ? { ...u, followStatus: 'pending' } : u
            ))
        }
        
        try {
            await followUser(username)
            await handleRefreshUser()
        } catch (err) {
            console.error("Failed to follow", err)
            handleGetFeed()
        }
    }

    const handleUnFollow = async (username) => {
        const updater = (prev) => prev.map(p => 
            p.user?.username === username ? { ...p, followStatus: 'none' } : p
        )
        setfeed(updater)
        setuserPosts(updater)
        setsavedPosts(updater)

        if (followContext?.setUsers) {
            followContext.setUsers(prev => prev.map(u => 
                u.username === username ? { ...u, followStatus: 'none' } : u
            ))
        }
        
        try {
            await unFollowUser(username)
            await handleRefreshUser()
        } catch (err) {
            console.error("Failed to unfollow", err)
            handleGetFeed()
        }
    }

    const handleSave = async (postId) => {
        const updater = (prev) => prev.map(p => 
            p._id === postId ? { ...p, isSaved: true } : p
        )
        setfeed(updater)
        setuserPosts(updater)
        setsavedPosts(updater)
        
        try {
            await savePost(postId)
        } catch (err) {
            console.error("Failed to save post", err)
            handleGetFeed()
        }
    }

    const handleUnSave = async (postId) => {
        const isSavedPage = window.location.pathname === '/saved'
        if (isSavedPage) {
            setsavedPosts(prev => prev.filter(p => p._id !== postId))
        }
        
        const updater = (prev) => prev.map(p => 
            p._id === postId ? { ...p, isSaved: false } : p
        )
        setfeed(updater)
        setuserPosts(updater)
        if (!isSavedPage) setsavedPosts(updater)
        
        try {
            await unsavePost(postId)
        } catch (err) {
            console.error("Failed to unsave post", err)
            handleGetFeed()
        }
    }

    const handleGetSavedPosts = async () => {
        if (!savedPosts || savedPosts.length === 0) setloading(true)
        try {
            const data = await getSavedPosts()
            setsavedPosts(data.posts)
        } catch (err) {
            console.error("Failed to fetch saved posts", err)
        } finally {
            setloading(false)
        }
    }


    const handleDelete = async (postId) => {
        const filter = (prev) => prev.filter(p => p._id !== postId)
        setfeed(filter)
        setuserPosts(filter)
        setsavedPosts(filter)
        
        try {
            await deletepost(postId)
        } catch (err) {
            console.error("Failed to delete post", err)
            handleGetFeed()
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

    return {loading,post,feed,userPosts,savedPosts,handleGetFeed,handleCreatePost,handleLike,handleUnLike,handleFollow,handleUnFollow,handleSave,handleUnSave,handleGetSavedPosts,handleGetUserPosts,handleDelete,handleToggleComments,handleAddComment,comments, activePost,handleDeleteComment}

}