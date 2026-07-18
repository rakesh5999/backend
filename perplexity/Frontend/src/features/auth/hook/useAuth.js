import {useDispatch} from 'react-redux';
import{register,login,getMe}from'../service/app.api.js';
import {setUser,setLoading}from'../auth.slice.js';

export function useAuth() {


  const dispatch = useDispatch();

  async function handleRegister({username, email, password}) {
    try {
      dispatch(setLoading(true));
      const data = await register({username, email, password});
    }catch (error) {
      console.error('Registration failed:', error);
    }finally {
      dispatch(setLoading(false));
    }
  }

  async function handleLogin({email, password}) {
    try {
      dispatch(setLoading(true));
      const data = await login({email, password});
      dispatch(setUser(data.user));
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetMe() {
    try {
      dispatch(setLoading(true));
      const data = await getMe();
      dispatch(setUser(data.user));
    } catch (error) {
      console.error('Fetching current user failed:', error);
    } finally {
      dispatch(setLoading(false));
    }
  }

  return {
    handleRegister,
    handleLogin,
    handleGetMe,
  };


}