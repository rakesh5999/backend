import React, { useEffect } from 'react'
import { useFollow } from '../hook/useFollow'
import '../style/people.scss'

const People = () => {

    const { users, loading, handleGetUsers, handleFollow, handleUnFollow } = useFollow()

    useEffect(() => {
        handleGetUsers()
    }, [])

    if (loading || !users) {
        return <main style={{display: 'flex', justifyContent: 'center', marginTop: '50px', color: 'var(--text-primary)'}}><h1>Loading...</h1></main>
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
                            <div className="user-info">
                                {user.profileImage ? (
                                    <img src={user.profileImage} alt={user.username} />
                                ) : (
                                    <div className="avatar-placeholder">
                                        {user.username[0].toUpperCase()}
                                    </div>
                                )}
                                <p>{user.username}</p>
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