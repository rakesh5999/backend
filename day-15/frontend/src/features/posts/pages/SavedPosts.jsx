import React, { useEffect } from 'react'
import { usePost } from '../hook/usePost'
import Post from '../components/Post'
import '../style/post.scss'

const SavedPosts = () => {
    const { loading, feed, handleGetSavedPosts, handleLike, handleUnLike, handleFollow, handleUnFollow, handleSave, handleUnSave, handleDelete, comments, activePost, handleToggleComments, handleAddComment, handleDeleteComment } = usePost()

    useEffect(() => {
        handleGetSavedPosts()
    }, [])

    if (loading && (!feed || feed.length === 0)) {
        return (
            <div className="feed-loading">
                <div className="spinner"></div>
            </div>
        )
    }

    return (
        <div className="feed-container">
            <div className="feed-header">
                <h2>Saved Posts</h2>
            </div>
            
            {feed && feed.length > 0 ? (
                <div className="posts-list">
                    {feed.map((post) => (
                        <Post
                            key={post._id}
                            post={post}
                            user={post.user}
                            handleLike={handleLike}
                            handleUnLike={handleUnLike}
                            handleFollow={handleFollow}
                            handleUnFollow={handleUnFollow}
                            handleSave={handleSave}
                            handleUnSave={handleUnSave}
                            handleDelete={handleDelete}
                            comments={comments}
                            activePost={activePost}
                            handleToggleComments={handleToggleComments}
                            handleAddComment={handleAddComment}
                            handleDeleteComment={handleDeleteComment}
                        />
                    ))}
                </div>
            ) : (
                <div className="no-posts">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <p>No saved posts yet</p>
                </div>
            )}
        </div>
    )
}

export default SavedPosts
