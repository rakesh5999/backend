import { followUser,unFollowUser, respondToRequest,getAllUser,getFollowRequests } from "../services/follow.api";
import { useContext  } from "react";
import { FollowContext } from "../follow.context";
import { useAuth } from "../../auth/hooks/useAuth";

export const useFollow = ()=>{
    const context=useContext(FollowContext)
    const {handleRefreshUser} = useAuth()
    const {loading,setLoading,users,setUsers,requests,setRequests} = context


    const handleGetUsers = async () => {
        if (!users || users.length === 0) setLoading(true)
        try {
            const data = await getAllUser()
            setUsers(data.usersWithStatus)
        } catch (err) {
            console.error("Failed to fetch users", err)
        } finally {
            setLoading(false)
        }
    }

    const handleFollow = async (username, onSuccess) => {
        // Optimistic update
        const previousUsers = [...users]
        setUsers(prev => prev.map(u => 
            u.username === username ? { ...u, followStatus: 'pending' } : u
        ))

        try {
            await followUser(username)
            await handleRefreshUser()
            if (onSuccess) await onSuccess()
        } catch (err) {
            console.error("Failed to follow", err)
            setUsers(previousUsers) // Revert on error
        }
    }

    const handleUnFollow = async (username, onSuccess) => {
        // Optimistic update
        const previousUsers = [...users]
        setUsers(prev => prev.map(u => 
            u.username === username ? { ...u, followStatus: 'none' } : u
        ))

        try {
            await unFollowUser(username)
            await handleRefreshUser()
            if (onSuccess) await onSuccess()
        } catch (err) {
            console.error("Failed to unfollow", err)
            setUsers(previousUsers) // Revert on error
        }
    }

    const handleGetRequests = async () => {
        if (!requests || requests.length === 0) setLoading(true)
        try {
            const data = await getFollowRequests()
            setRequests(data.response)
        } catch (err) {
            console.error("Failed to fetch requests", err)
        } finally {
            setLoading(false)
        }
    }


const handleRespond = async (requestId, status) =>{
    // Optimistic update
    setRequests(prev => prev.filter(r => r._id !== requestId))
    
    try {
        await respondToRequest(requestId,status)
        await handleRefreshUser()
    } catch (err) {
        console.error("Failed to respond to request", err)
        await handleGetRequests() // Revert on error
    }
}

   return{loading,users,requests,handleGetUsers,handleFollow,handleUnFollow,handleGetRequests,handleRespond}

}
