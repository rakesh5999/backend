import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api= axios.create({
    baseURL: `${API_URL}/api/auth`,
    withCredentials:true
})

const userApi = axios.create({
    baseURL: `${API_URL}/api/users`,
    withCredentials: true
})


export async function login(username,password){
   
        const response= await api.post("/login",{
            username,
            password
        })
        return response.data

}


export async function register(username,email,password){
   
        const response= await api.post("/register",{
            username,
            email,
            password
        })
        return response.data
   
}




export async function getme(){
   
        const response = await api.get("/get-me")
        return response.data

}


export async function logout() {
    const response = await api.post("/logout")
    return response.data
}




export async function updateProfile(imageFile) {
    const formData = new FormData()
    formData.append("image", imageFile)

    const response = await userApi.patch("/update", formData)
    return response.data
}