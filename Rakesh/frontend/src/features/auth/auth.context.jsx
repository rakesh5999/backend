import { createContext,useState,useEffect } from "react";
import { getme } from "./services/auth.api";

export const AuthContext= createContext()

export function AuthProvider({children}){

    const [user, setuser] = useState(null)
    const [loading, setloading] = useState(true)

    useEffect(() => {
        async function loadUser() {
            try {
                const response = await getme()
                setuser(response.user)
            } catch (err) {
                setuser(null)
            } finally {
                setloading(false)
            }
        }
        loadUser()
    }, [])
    
    return(
        <AuthContext.Provider value={{user,setuser,loading,setloading}}>
            {children}
        </AuthContext.Provider>
    )
}