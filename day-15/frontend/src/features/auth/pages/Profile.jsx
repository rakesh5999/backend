import React, { useRef, useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { usePost } from '../../posts/hook/usePost'
import { getUserProfile } from '../../follow/services/follow.api'
import Post from '../../posts/components/Post'
import '../style/profile.scss'
import { followUser, unFollowUser } from '../../follow/services/follow.api'
import { FollowContext } from '../../follow/follow.context'

const Profile = () => {
    const navigate = useNavigate()
    const { user, loading: authLoading, handleUpdateProfile, handleRefreshUser } = useAuth()
    const imageRef = useRef(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedPostId, setSelectedPostId] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [previewUrl, setPreviewUrl] = useState(null)
    const [localProfileImage, setLocalProfileImage] = useState(null)
    const [editBio, setEditBio] = useState("")
    const [listModal, setListModal] = useState({ isOpen: false, type: '', data: [] })
    
    const { username: urlUsername } = useParams()
    const [profileUser, setProfileUser] = useState(null)
    const [profileLoading, setProfileLoading] = useState(true)
    
    const { 
        loading, 
        userPosts, 
        savedPosts, 
        handleGetUserPosts, 
        handleGetSavedPosts, 
        handleLike, 
        handleUnLike, 
        handleFollow, 
        handleUnFollow, 
        handleSave, 
        handleUnSave, 
        handleDelete, 
        comments, 
        activePost, 
        handleToggleComments, 
        handleAddComment, 
        handleDeleteComment 
    } = usePost()
    const followContext = useContext(FollowContext)
    const posts = userPosts || []

    useEffect(() => {
        async function fetchProfile() {
            const targetUsername = urlUsername || user?.username
            
            if (targetUsername) {
                try {
                    // Fetch profile and posts in parallel
                    const [profileData] = await Promise.all([
                        getUserProfile(targetUsername),
                        handleGetUserPosts(targetUsername)
                    ])
                    setProfileUser(profileData.user)
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
        
        setUploading(true)
        try {
            await handleUpdateProfile(file, editBio)
            setIsEditModalOpen(false)
            setPreviewUrl(null)
            if (file) {
                const url = URL.createObjectURL(file)
                setLocalProfileImage(url)
            }
        } catch (err) {
            console.error("Failed to update profile", err)
        } finally {
            setUploading(false)
        }
    }

    if (authLoading || profileLoading) {
        return <main style={{display: 'flex', justifyContent: 'center', marginTop: '50px', color: 'var(--text-primary)'}}><h1>Loading...</h1></main>
    }

    const selectedPost = posts.find(p => p._id === selectedPostId)

    return (
        <div className="profile-page">
            <header className="profile-header">
                <div className="profile-avatar-container">
                    <img src={localProfileImage || (profileUser?.profileImage ? `${profileUser.profileImage}?tr=w-150,h-150,fo-auto` : "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg")} alt="profile" />
                </div>

                <div className="profile-info">
                    <div className="profile-top">
                        <h2 className="username">{profileUser?.username || "user"}</h2>
                        {isOwnProfile ? (
                            <button className="edit-profile-btn" onClick={() => {
                                setEditBio(profileUser?.bio || "")
                                setIsEditModalOpen(true)
                            }}>
                                Edit Profile
                            </button>
                        ) : (
                            <button 
                                className={`follow-btn ${profileUser?.followStatus}`}
                                onClick={async () => {
                                    const prevStatus = profileUser.followStatus
                                    const newStatus = (prevStatus === 'following' || prevStatus === 'pending') ? 'none' : 'pending'
                                    
                                    // Optimistic update
                                    setProfileUser(prev => ({ ...prev, followStatus: newStatus }))
                                    
                                    try {
                                        if (prevStatus === 'following' || prevStatus === 'pending') {
                                            await handleUnFollow(profileUser.username)
                                        } else {
                                            await handleFollow(profileUser.username)
                                        }
                                        
                                        // Refresh profile data to get real counts (followers/following)
                                        const data = await getUserProfile(profileUser.username)
                                        setProfileUser(data.user)
                                    } catch (err) {
                                        console.error("Follow action failed", err)
                                        setProfileUser(prev => ({ ...prev, followStatus: prevStatus }))
                                    }
                                }}
                                style={{
                                    marginLeft: '20px',
                                    padding: '6px 16px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border-light)',
                                    background: profileUser?.followStatus === 'none' ? 'var(--accent-blue)' : 'rgba(255,255,255,0.1)',
                                    color: profileUser?.followStatus === 'none' ? 'white' : 'var(--text-primary)',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
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
                            <span className="stat-count">{posts.length}</span> posts
                        </div>
                        <div className="stat" onClick={() => setListModal({ isOpen: true, type: 'Followers', data: profileUser?.followers || [] })} style={{cursor: 'pointer'}}>
                            <span className="stat-count">{profileUser?.followers?.length || 0}</span> followers
                        </div>
                        <div className="stat" onClick={() => setListModal({ isOpen: true, type: 'Following', data: profileUser?.following || [] })} style={{cursor: 'pointer'}}>
                            <span className="stat-count">{profileUser?.following?.length || 0}</span> following
                        </div>
                    </div>

                    <div className="profile-bio">
                        <p style={{fontWeight: '600'}}>Bio</p>
                        <p>{profileUser?.bio || "No bio yet"}</p>
                        {isOwnProfile && <div className="bio-name" style={{fontSize: '0.85rem', color: 'var(--text-secondary)'}}>{profileUser?.email}</div>}
                    </div>
                </div>
            </header>

            {/* Mobile Stats (only visible on mobile) */}
            <div className="profile-stats-mobile">
                <div className="stat">
                    <span className="stat-count">{posts.length}</span>
                    <span>posts</span>
                </div>
                <div className="stat" onClick={() => setListModal({ isOpen: true, type: 'Followers', data: profileUser?.followers || [] })}>
                    <span className="stat-count">{profileUser?.followers?.length || 0}</span>
                    <span>followers</span>
                </div>
                <div className="stat" onClick={() => setListModal({ isOpen: true, type: 'Following', data: profileUser?.following || [] })}>
                    <span className="stat-count">{profileUser?.following?.length || 0}</span>
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
                {posts.map(post => (
                    <div className="grid-item" key={post._id} onClick={() => setSelectedPostId(post._id)}>
                        <img src={post.imgUri ? `${post.imgUri}?tr=w-300,h-300,fo-auto` : ""} alt="Post" />
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
                                
                                <div className="bio-edit-field" style={{width: '100%', marginTop: '20px'}}>
                                    <label style={{display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)'}}>Bio</label>
                                    <textarea 
                                        value={editBio}
                                        onChange={(e) => setEditBio(e.target.value)}
                                        placeholder="Write your bio..."
                                        rows="4"
                                        style={{
                                            width: '100%',
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid var(--border-light)',
                                            borderRadius: '8px',
                                            padding: '12px',
                                            color: 'var(--text-primary)',
                                            resize: 'none',
                                            fontSize: '0.9rem'
                                        }}
                                    />
                                </div>

                                <button type="submit" className="button primary-button save-btn" disabled={uploading}>
                                    {uploading ? "Saving..." : "Save Changes"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            {selectedPost && (
                <div className="post-view-modal" onClick={() => setSelectedPostId(null)}>
                    <div className="post-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-modal" onClick={() => setSelectedPostId(null)}>×</button>
                        <div className="feed-page" style={{padding: 0, width: '100%'}}>
                            <div className="feed" style={{maxWidth: '100%'}}>
                                <div className="posts">
                                    <Post 
                                        user={selectedPost.user}
                                        post={selectedPost}
                                        loading={false}
                                        handleLike={handleLike}
                                        handleUnLike={handleUnLike}
                                        handleFollow={handleFollow} 
                                        handleUnFollow={handleUnFollow} 
                                        handleSave={handleSave}
                                        handleUnSave={handleUnSave}
                                        handleDelete={(id) => {
                                            handleDelete(id)
                                            setSelectedPostId(null)
                                        }}
                                        comments={comments}
                                        activePost={activePost}
                                        handleToggleComments={handleToggleComments}
                                        handleAddComment={handleAddComment}
                                        handleDeleteComment={handleDeleteComment}
                                        hideFollow={true}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {listModal.isOpen && (
                <div className="list-modal-overlay" onClick={() => setListModal({ ...listModal, isOpen: false })}>
                    <div className="list-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="list-modal-header">
                            <h3>{listModal.type}</h3>
                            <button className="close-btn" onClick={() => setListModal({ ...listModal, isOpen: false })}>✕</button>
                        </div>
                        <div className="list-modal-body">
                            {listModal.data.length === 0 ? (
                                <p className="no-data">No {listModal.type.toLowerCase()} yet</p>
                            ) : (
                                listModal.data.map((u) => (
                                    <div className="list-item" key={u._id} onClick={() => {
                                        setListModal({ ...listModal, isOpen: false });
                                        navigate(`/profile/${u.username}`);
                                    }}>
                                        <img src={u.profileImage || "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"} alt={u.username} />
                                        <div className="item-info">
                                            <span className="username">{u.username}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Profile