import React, { useEffect } from 'react'
import '../style/people.scss'
import { useFollow } from '../hook/useFollow'

const FollowRequests = () => {

    const { handleGetRequests, requests, handleRespond } = useFollow()

    useEffect(() => {
        handleGetRequests()
    }, [])

    return (
        <div className='people-page'>
            <div className="people-container">
                <div className="header">
                    <h1>Follow Requests</h1>
                </div>
                <div className="users-list">
                    {!requests || requests.length === 0 ? (
                        <div className="empty-state">No pending requests</div>
                    ) : (
                        requests.map(request => (
                            <div key={request.follower} className="user-row">
                                <div className="user-info">
                                    <div className="avatar-placeholder">{request.follower.charAt(0).toUpperCase()}</div>
                                    <div className="user-details">
                                        <p className="username">{request.follower}</p>
                                        <p className="suggestion-reason">wants to follow you</p>
                                    </div>
                                </div>
                                <div className="respond-btns">
                                    <button 
                                        className='accept'
                                        onClick={() => handleRespond(request._id, 'accepted')}
                                    >
                                        Confirm
                                    </button>
                                    <button 
                                        className='reject'
                                        onClick={() => handleRespond(request._id, 'rejected')}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default FollowRequests