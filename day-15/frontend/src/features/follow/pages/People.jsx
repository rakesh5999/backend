import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useFollow } from '../hook/useFollow'
import '../style/people.scss'

const People = () => {
    const navigate = useNavigate()
    const { users, loading, handleGetUsers, handleFollow, handleUnFollow } = useFollow()

    useEffect(() => {
        handleGetUsers()
    }, [])

    if (loading || !users) {
        return (
            <div className="people-page">
                <div className="people-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                    <h1 style={{ color: 'var(--text-primary)', fontSize: '1.2rem' }}>Loading...</h1>
                </div>
            </div>
        )
    }

    return (
        <div className="people-page">
            <div className="people-container">
                <div className="header">
                    <h1>Suggested for you</h1>
                </div>
                <div className="users-list">
                    {users.map((user) => (
                        <div className="user-row" key={user.username}>
                            <div className="user-info" onClick={() => navigate(`/profile/${user.username}`)} style={{cursor: 'pointer'}}>
                                {user.profileImage ? (
                                    <img src={user.profileImage} alt={user.username} />
                                ) : (
                                    <div className="avatar-placeholder">
                                        {user.username[0].toUpperCase()}
                                    </div>
                                )}
                                <div className="user-details">
                                    <p className="username">{user.username}</p>
                                    <p className="suggestion-reason">Suggested for you</p>
                                </div>
                            </div>
                            <button
                                className={`follow-btn ${user.followStatus}`}
                                onClick={() => {
                                    if (user.followStatus === 'following' || user.followStatus === 'pending') {
                                        handleUnFollow(user.username)
                                    } else {
                                        handleFollow(user.username)
                                    }
                                }}
                            >
                                {user.followStatus === 'following' ? 'Following'
                                    : user.followStatus === 'pending' ? 'Requested'
                                    : 'Follow'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default People