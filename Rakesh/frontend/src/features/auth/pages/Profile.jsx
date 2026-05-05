import React, { useRef, useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { usePost } from '../../posts/hook/usePost'
import '../style/profile.scss'

const Profile = () => {
    const { user, loading: authLoading, handleUpdateProfile } = useAuth()
    const { feed, handleGetFeed } = usePost()
    const imageRef = useRef(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        if (!feed || feed.length === 0) {
            handleGetFeed()
        }
    }, [])

    async function handleSubmit(e) {
        e.preventDefault()
        const file = imageRef.current.files[0]
        if (file) {
            setUploading(true)
            await handleUpdateProfile(file)
            setUploading(false)
            setIsEditModalOpen(false)
        }
    }

    if (authLoading) {
        return <main style={{display: 'flex', justifyContent: 'center', marginTop: '50px', color: 'var(--text-primary)'}}><h1>Loading...</h1></main>
    }

    // Filter feed for user's own posts
    const userPosts = feed ? feed.filter(p => p.user.username === user?.username) : []

    return (
        <div className="profile-page">
            <header className="profile-header">
                <div className="profile-avatar-container">
                    <img src={user?.profileImage || "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"} alt="profile" />
                </div>

                <div className="profile-info">
                    <div className="profile-top">
                        <h2 className="username">{user?.username || "user"}</h2>
                        <button className="edit-profile-btn" onClick={() => setIsEditModalOpen(true)}>
                            Edit Profile
                        </button>
                    </div>

                    <div className="profile-stats">
                        <div className="stat">
                            <span className="stat-count">{userPosts.length}</span> posts
                        </div>
                        <div className="stat">
                            <span className="stat-count">{user?.followers?.length || 0}</span> followers
                        </div>
                        <div className="stat">
                            <span className="stat-count">{user?.following?.length || 0}</span> following
                        </div>
                    </div>

                    <div className="profile-bio">
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
                    <div className="grid-item" key={post._id}>
                        <img src={post.imgUri} alt="Post" />
                        <div className="grid-item-overlay">
                            <div className="overlay-stat">
                                <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                                {post.likes?.length || 0}
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
                            <img src={user?.profileImage || "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"} alt="Current Avatar" className="current-avatar" />
                            
                            <form onSubmit={handleSubmit} style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                <label htmlFor="profileImage" className="file-label">
                                    Change profile photo
                                </label>
                                <input
                                    ref={imageRef}
                                    hidden
                                    type="file"
                                    id="profileImage"
                                />
                                <button type="submit" className="button primary-button save-btn" disabled={uploading}>
                                    {uploading ? "Saving..." : "Save Changes"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Profile