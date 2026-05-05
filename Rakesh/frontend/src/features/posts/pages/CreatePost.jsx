import React, { useRef, useState } from 'react'
import '../style/createpost.scss'
import { usePost } from '../hook/usePost'
import { useNavigate } from 'react-router'

const CreatePost = () => {

    const imageRef = useRef(null)
    const [caption, setcaption] = useState("")
    const [previewImage, setPreviewImage] = useState(null)
    
    const { loading, handleCreatePost } = usePost()
    const navigate = useNavigate()

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviewImage(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const file = imageRef.current.files[0]

        if (!file) return;

        await handleCreatePost(file, caption)
        navigate('/feed')
    }

    return (
        <div className="create-post-main">
            <div className="post-form-container">
                <div className="form-header">
                    <button className="back-button" onClick={() => navigate(-1)} type="button">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                    </button>
                    <h1>Create new post</h1>
                    <button 
                        className="submit-btn-top" 
                        onClick={handleSubmit} 
                        disabled={loading || !previewImage}
                    >
                        {loading ? 'Sharing...' : 'Share'}
                    </button>
                </div>

                <form className="post-form" onSubmit={handleSubmit}>
                    {!previewImage ? (
                        <div className="upload-section">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                <polyline points="21 15 16 10 5 21"></polyline>
                            </svg>
                            <p>Drag photos and videos here</p>
                            <label htmlFor="postImage" className="create-post-label">
                                Select from computer
                            </label>
                            <input
                                onChange={handleImageChange}
                                ref={imageRef}
                                hidden
                                type="file"
                                id="postImage"
                                accept="image/*"
                            />
                        </div>
                    ) : (
                        <>
                            <div className="image-preview-wrapper">
                                <img src={previewImage} alt="Preview" className="image-preview" />
                            </div>
                            <div className="input-group">
                                <input
                                    onInput={(e) => { setcaption(e.target.value) }}
                                    type="text"
                                    name='caption'
                                    placeholder='Write a caption...' 
                                />
                            </div>
                        </>
                    )}
                    <button type="submit" className="submit-button">Submit</button>
                </form>
            </div>
        </div>
    )
}

export default CreatePost
