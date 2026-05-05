import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api =axios.create({
    baseURL: API_URL,
    withCredentials:true
})


export async function followUser(username) {
    const response = await api.post("/api/users/follow/" +username)
    return response.data
}


export async function unFollowUser(username) {
    const response = await api.post("/api/users/unfollow/" +username)
    return response.data
}

export async function respondToRequest(username, status) {
    const response = await api.patch("/api/users/follow/" +username,{status})
    return response.data
}


export async function getAllUser(){

    const response= await api.get('/api/users/use')

    return response.data
}


export async function getFollowRequests(){

    const response=await api.get("/api/users/follow/requests")

    return response.data

}