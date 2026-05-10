import React, { useRef, useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { usePost } from '../../posts/hook/usePost'
import { getUserProfile } from '../../follow/services/follow.api'
import Post from '../../posts/components/Post'
import '../style/profile.scss'
import { followUser, unFollowUser } from '../../follow/services/follow.api'

const Profile = () => {
    const { user, loading: authLoading, handleUpdateProfile, handleRefreshUser } = useAuth()
    const imageRef = useRef(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedPost, setSelectedPost] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [previewUrl, setPreviewUrl] = useState(null)
    const [localProfileImage, setLocalProfileImage] = useState(null)
    
    const { username: urlUsername } = useParams()
    const [profileUser, setProfileUser] = useState(null)
    const [profileLoading, setProfileLoading] = useState(true)
    
    const { 
        feed, 
        handleGetUserPosts, 
        handleLike, 
        handleUnLike, 
        handleSave,
        handleUnSave,
        handleFollow: handleFollowPost,
        handleUnFollow: handleUnFollowPost,
        handleDelete, 
        comments, 
        activePost, 
        handleToggleComments, 
        handleAddComment, 
        handleDeleteComment 
    } = usePost()

    useEffect(() => {
        async function fetchProfile() {
            setProfileLoading(true)
            const targetUsername = urlUsername || user?.username
            
            if (targetUsername) {
                try {
                    const data = await getUserProfile(targetUsername)
                    setProfileUser(data.user)
                    await handleGetUserPosts(targetUsername)
                } catch (err) {
                    console.error("Failed to load profile", err)
                }
            }
            setProfileLoading(false)
        }
        
        if (user || urlUsername) fetchProfile()
    }, [urlUsername, user])

    const isOwnProfile = !urlUsername || urlUsername === user?.username

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()
        const file = imageRef.current.files[0]
        if (file) {
            setUploading(true)
            // Optimistic update
            const url = URL.createObjectURL(file)
            setLocalProfileImage(url)
            
            try {
                await handleUpdateProfile(file)
                setIsEditModalOpen(false)
                setPreviewUrl(null)
            } catch (err) {
                console.error("Failed to update profile image", err)
                setLocalProfileImage(null) // Revert on error
            } finally {
                setUploading(false)
            }
        }
    }

    if (authLoading || profileLoading) {
        return <main style={{display: 'flex', justifyContent: 'center', marginTop: '50px', color: 'var(--text-primary)'}}><h1>Loading...</h1></main>
    }

    const userPosts = feed || []

    return (
        <div className="profile-page">
            <header className="profile-header">
                <div className="profile-avatar-container">
                    <img src={localProfileImage || user?.profileImage || "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"} alt="profile" />
                </div>

                <div className="profile-info">
                    <div className="profile-top">
                        <h2 className="username">{profileUser?.username || "user"}</h2>
                        {isOwnProfile ? (
                            <button className="edit-profile-btn" onClick={() => setIsEditModalOpen(true)}>
                                Edit Profile
                            </button>
                        ) : (
                            <button 
                                className={`follow-btn ${profileUser?.followStatus}`}
                                onClick={async () => {
                                    if (profileUser.followStatus === 'following' || profileUser.followStatus === 'pending') {
                                        await unFollowUser(profileUser.username)
                                    } else {
                                        await followUser(profileUser.username)
                                    }
                                    // Refresh profile data
                                    const data = await getUserProfile(profileUser.username)
                                    setProfileUser(data.user)
                                }}
                                style={{
                                    marginLeft: '20px',
                                    padding: '6px 16px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border-light)',
                                    background: profileUser?.followStatus === 'none' ? 'var(--accent-blue)' : 'rgba(255,255,255,0.1)',
                                    color: profileUser?.followStatus === 'none' ? 'white' : 'var(--text-primary)',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                {profileUser?.followStatus === 'following' ? 'Following' 
                                 : profileUser?.followStatus === 'pending' ? 'Requested' 
                                 : 'Follow'}
                            </button>
                        )}
                    </div>

                    <div className="profile-stats">
                        <div className="stat">
                            <span className="stat-count">{userPosts.length}</span> posts
                        </div>
                        <div className="stat">
                            <span className="stat-count">{profileUser?.followers?.length || 0}</span> followers
                        </div>
                        <div className="stat">
                            <span className="stat-count">{profileUser?.following?.length || 0}</span> following
                        </div>
                    </div>

                    <div className="profile-bio">
                        <p>{profileUser?.bio || "No bio yet"}</p>
                    </div>
                        <div className="bio-name">{user?.email}</div>
                    </div>
                </div>
            </header>

            {/* Mobile Stats (only visible on mobile) */}
            <div className="profile-stats-mobile">
                <div className="stat">
                    <span className="stat-count">{userPosts.length}</span>
                    <span>posts</span>
                </div>
                <div className="stat">
                    <span className="stat-count">{user?.followers?.length || 0}</span>
                    <span>followers</span>
                </div>
                <div className="stat">
                    <span className="stat-count">{user?.following?.length || 0}</span>
                    <span>following</span>
                </div>
            </div>

            <div className="profile-tabs">
                <div className="tab active">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                    POSTS
                </div>
            </div>

            <div className="profile-grid">
                {userPosts.map(post => (
                    <div className="grid-item" key={post._id} onClick={() => setSelectedPost(post)}>
                        <img src={post.imgUri} alt="Post" />
                        <div className="grid-item-overlay">
                            <div className="overlay-stat">
                                <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                                {post.likesCount || 0}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isEditModalOpen && (
                <div className="edit-profile-modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Edit Profile</h2>
                            <button onClick={() => setIsEditModalOpen(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <img src={previewUrl || profileUser?.profileImage || "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"} alt="Avatar Preview" className="current-avatar" />
                            
                            <form onSubmit={handleSubmit} style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                <label htmlFor="profileImage" className="file-label">
                                    {previewUrl ? "Change selection" : "Change profile photo"}
                                </label>
                                <input
                                    ref={imageRef}
                                    hidden
                                    type="file"
                                    id="profileImage"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                />
                                <button type="submit" className="button primary-button save-btn" disabled={uploading}>
                                    {uploading ? "Saving..." : "Save Changes"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            {selectedPost && (
                <div className="post-view-modal" onClick={() => setSelectedPost(null)}>
                    <div className="post-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-modal" onClick={() => setSelectedPost(null)}>×</button>
                        <div className="feed-page" style={{padding: 0, width: '100%'}}>
                            <div className="feed" style={{maxWidth: '100%'}}>
                                <div className="posts">
                                    <Post 
                                        user={selectedPost.user}
                                        post={selectedPost}
                                        loading={false}
                                        handleLike={handleLike}
                                        handleUnLike={handleUnLike}
                                        handleFollow={handleFollowPost} 
                                        handleUnFollow={handleUnFollowPost} 
                                        handleSave={handleSave}
                                        handleUnSave={handleUnSave}
                                        handleDelete={(id) => {
                                            handleDelete(id)
                                            setSelectedPost(null)
                                        }}
                                        comments={comments}
                                        activePost={activePost}
                                        handleToggleComments={handleToggleComments}
                                        handleAddComment={handleAddComment}
                                        handleDeleteComment={handleDeleteComment}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Profile