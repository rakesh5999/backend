import React, { useEffect } from 'react'
import { usePost } from '../hook/usePost'
import Post from '../components/Post'
import '../style/feed.scss'

const SavedPosts = () => {
    const { loading, savedPosts, handleGetSavedPosts, handleLike, handleUnLike, handleFollow, handleUnFollow, handleSave, handleUnSave, handleDelete, comments, activePost, handleToggleComments, handleAddComment, handleDeleteComment } = usePost()

    useEffect(() => {
        handleGetSavedPosts()
    }, [])

    if (loading && (!savedPosts || savedPosts.length === 0)) {
        return (
            <div className="feed-loading">
                <div className="spinner"></div>
            </div>
        )
    }

    return (
        <div className="feed-page">
            <div className="feed">
                <div className="feed-header" style={{
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '0 16px'
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--text-secondary)'}}>
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <h2 style={{fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)'}}>Saved</h2>
                </div>
                
                {savedPosts && savedPosts.length > 0 ? (
                    <div className="posts">
                        {savedPosts.map((post) => (
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
                    <div className="no-posts" style={{
                        marginTop: '100px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '16px',
                        color: 'var(--text-secondary)'
                    }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            border: '2px solid var(--border-light)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                            </svg>
                        </div>
                        <p style={{fontSize: '1.2rem', fontWeight: '500'}}>No saved posts yet</p>
                        <p style={{fontSize: '0.9rem', textAlign: 'center', maxWidth: '300px'}}>When you save photos and videos, they'll appear here.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SavedPosts
