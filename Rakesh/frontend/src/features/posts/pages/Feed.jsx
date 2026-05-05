import React, { useEffect } from 'react'
import "../style/feed.scss"
import Post from '../components/Post'
import { usePost } from '../hook/usePost'
import { useFollow } from '../../follow/hook/useFollow'

const Feed = () => {

  const { feed, handleGetFeed, loading, handleLike, handleUnLike ,handleDelete, comments, activePost, handleToggleComments, handleAddComment,handleDeleteComment} = usePost()
  const { handleFollow, handleUnFollow } = useFollow()  
  useEffect(() => {
    handleGetFeed()
  }, [])

  if (loading || !feed) {
    return <main style={{display: 'flex', justifyContent: 'center', marginTop: '50px', color: 'var(--text-primary)'}}><h1>Loading...</h1></main>
  }

  return (
    <div className='feed-page'>
      <div className="feed">
        <div className="posts">
          {feed.map(post => (
            <Post
              key={post._id}
              user={post.user}
              post={post}
              loading={loading}
              handleLike={handleLike}
              handleUnLike={handleUnLike}
              handleFollow={(username) => handleFollow(username, handleGetFeed)}   
              handleUnFollow={(username) => handleUnFollow(username, handleGetFeed)}
              handleDelete={handleDelete}
              comments={comments}
              activePost={activePost}
              handleToggleComments={handleToggleComments}
              handleAddComment={handleAddComment}
              handleDeleteComment={handleDeleteComment}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Feed