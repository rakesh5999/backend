import { followUser,unFollowUser, respondToRequest,getAllUser,getFollowRequests } from "../services/follow.api";
import { useContext  } from "react";
import { FollowContext } from "../follow.context";

export const useFollow = ()=>{
    const context=useContext(FollowContext)
    const {loading,setLoading,users,setUsers,requests,setRequests} = context


    const handleGetUsers= async () => {

    setLoading(true)

    const data = await getAllUser()

    setUsers(data.usersWithStatus)

    setLoading(false)

}

const handleFollow =async(username,onSuccess)=>{
  const data = await followUser(username)
   await handleGetUsers()
    if (onSuccess) await onSuccess()
}




const handleUnFollow =async(username,onSuccess)=>{
  const data = await unFollowUser(username)
   await handleGetUsers()
    if (onSuccess) await onSuccess()
}

const handleGetRequests = async () => {
    
    setLoading(true)

    const data = await getFollowRequests()

    setRequests(data.response)

    setLoading(false)
}


const handleRespond = async (username, status) =>{
    const data = await respondToRequest(username,status)
    await handleGetRequests()
}

   return{loading,users,requests,handleGetUsers,handleFollow,handleUnFollow,handleGetRequests,handleRespond}

}
