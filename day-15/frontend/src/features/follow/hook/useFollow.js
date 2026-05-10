import { followUser,unFollowUser, respondToRequest,getAllUser,getFollowRequests } from "../services/follow.api";
import { useContext  } from "react";
import { FollowContext } from "../follow.context";
import { useAuth } from "../../auth/hooks/useAuth";

export const useFollow = ()=>{
    const context=useContext(FollowContext)
    const {handleRefreshUser} = useAuth()
    const {loading,setLoading,users,setUsers,requests,setRequests} = context


    const handleGetUsers= async () => {

    setLoading(true)

    const data = await getAllUser()

    setUsers(data.usersWithStatus)

    setLoading(false)

}

const handleFollow =async(username,onSuccess)=>{
  await followUser(username)
   await handleGetUsers()
   await handleRefreshUser()
    if (onSuccess) await onSuccess()
}




const handleUnFollow =async(username,onSuccess)=>{
  await unFollowUser(username)
   await handleGetUsers()
   await handleRefreshUser()
    if (onSuccess) await onSuccess()
}

const handleGetRequests = async () => {
    
    setLoading(true)

    const data = await getFollowRequests()

    setRequests(data.response)

    setLoading(false)
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
