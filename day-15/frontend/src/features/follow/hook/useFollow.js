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
    await respondToRequest(requestId,status)
    await handleGetRequests()
    await handleRefreshUser()
}

   return{loading,users,requests,handleGetUsers,handleFollow,handleUnFollow,handleGetRequests,handleRespond}

}
