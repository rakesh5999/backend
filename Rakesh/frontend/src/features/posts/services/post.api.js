import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api =axios.create({
    baseURL: API_URL,
    withCredentials:true
})

export async function getFeed(){
    const response= await api.get('/api/posts/feed')
    return response.data
}


export async function createPost(imageFile,caption){

    const formData =new FormData()

    formData.append("image",imageFile)
    formData.append("caption",caption)

    const response= await api.post("/api/posts", formData)

    return response.data

}

export async function likepost(postId) {

    const response=await api.post("/api/posts/like/"+postId)

    return response.data
}


export async function unlikepost(postId) {

    const response=await api.post("/api/posts/unlike/"+postId)

    return response.data
}


export async function deletepost(postId) {
    const response = await api.delete("/api/posts/delete/" + postId)
    return response.data
}

export async function addcomment(postId,text){
     const response=await api.post("/api/posts/comments/"+postId,{text})
      return response.data
}

export async function getcomment(postId){
     const response=await api.get("/api/posts/comments/"+postId)
      return response.data
}

export async function deletecomment(commentId) {
    const response = await api.delete("/api/posts/comments/delete/" + commentId)
    return response.data
}