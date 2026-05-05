import React, { useState } from 'react'
import { useContext } from 'react'
import { AuthContext } from '../../auth/auth.context'

const Post = ({ user, post, loading, handleLike, handleUnLike, handleFollow, handleUnFollow, handleDelete, comments, activePost, handleToggleComments, handleAddComment,handleDeleteComment }) => {

  const { user: loggedInUser } = useContext(AuthContext)
  const isOwnPost = loggedInUser?.username === user.username
  const [commentText, setCommentText] = useState("") 
  
  const handleSubmitComment = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) return  
    await handleAddComment(post._id, commentText)
    setCommentText("")  
  }

  return (
    <article className="post">

      <div className="user">
        <div className="img-wrapper">
          <img src={user.profileImage || "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"} alt={user.username} />
        </div>
        <span className="username-text">{user.username}</span>

        {!isOwnPost && (
          <>
            <span style={{color: 'var(--text-secondary)', fontSize: '14px', margin: '0 4px'}}>•</span>
            <button
              className={`follow-btn ${post.followStatus}`}
              onClick={() => {
                if (post.followStatus === 'following' || post.followStatus === 'pending') {
                  handleUnFollow(user.username)
                } else {
                  handleFollow(user.username)
                }
              }}
            >
              {post.followStatus === 'following' ? 'Following'
                : post.followStatus === 'pending' ? 'Requested'
                : 'Follow'}
            </button>
          </>
        )}
      </div>

      <img src={post.imgUri} alt="Post content" />

      <div className="icons">
        <div className="left">
          <button onClick={() => { post.isLiked ? handleUnLike(post._id) : handleLike(post._id) }}>
            {post.isLiked ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ed4956" stroke="#ed4956" strokeWidth="1">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            )}
          </button>

          <button onClick={() => handleToggleComments(post._id)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
          </button>

          <button>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>

        <div className="right">
          {isOwnPost ? (
            <button onClick={() => handleDelete(post._id)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          ) : (
            <button>
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                 <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
               </svg>
            </button>
          )}
        </div>
      </div>

      <div className="likes-count">
        {post.likes?.length || 0} likes
      </div>

      <div className="bottom">
        <p className='caption'>
          <span className="caption-username">{user.username}</span>
          {post.caption}
        </p>
      </div>

      <div className="comments-section">
        {!activePost && comments && comments.length > 0 && (
           <button className="view-comments-btn" onClick={() => handleToggleComments(post._id)}>
             View all {comments.length} comments
           </button>
        )}

        {activePost === post._id && (
          <>
            <div className="comments-list">
              {comments.length === 0 && <p className="no-comments">No comments yet</p>}
              {comments.map((comment) => (
                <div className="comment" key={comment._id}>
                  <span className="comment-user">{comment.user}</span>
                  <span className="comment-text">{comment.text}</span>

                  {comment.user === loggedInUser?.username && (
                    <button 
                        className="comment-delete"
                        onClick={() => handleDeleteComment(comment._id)}>
                        ✕
                    </button>
                  )}
                </div>
              ))}
            </div>

            <form className="comment-form" onSubmit={handleSubmitComment}>
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button type="submit" className="comment-submit" disabled={!commentText.trim()}>Post</button>
            </form>
          </>
        )}
      </div>

    </article>
  )
}

export default Post