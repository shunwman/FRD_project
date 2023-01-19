import { useState,useEffect } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { clearInterval } from "timers"
import image from "../assets/people.png"
import store, { IRootState } from "../redux/store"
import { fetchRegister } from "../redux/user/thunk"
import {useNavigate } from "react-router-dom";
import logo from "../assets/cooking.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle,faFacebook } from '@fortawesome/free-brands-svg-icons'
import { Select } from '@chakra-ui/react'
import { Placeholder } from "react-bootstrap"
interface LoginFormType {
    username: string
    password: string
    email: string
    user_Icon: string
}
const useAppDispatch = () => useDispatch<typeof store.dispatch>()
export default function Login() {
    
    const navigate = useNavigate()
    const isLoggedIn = useSelector((state: IRootState) => state.user.isLoggedIn)
    const displayName = useSelector((state: IRootState) => state.user.displayName)
    const errMsg = useSelector((state: IRootState) => state.user.errMsg)
    const [show, setShow] = useState(false);
    const [intervalId, setIntervalId] = useState<NodeJS.Timer>()
    // const dispatch = ()useDispatch()
    const dispatch = useAppDispatch()

    const {register, handleSubmit} = useForm<LoginFormType>({
        defaultValues: {
            username: "",
            password: "",
            email: "",
            user_Icon: "",
        }
    })
    const onSubmit = async (data: LoginFormType) => {
        setShow(true)
        const callApi = new Promise<void>((resolve, reject) => {
            setTimeout(async () => {
               try {
                const result = await dispatch(fetchRegister({
                    username: data.username,
                    password: data.password,
                    email: data.email,
                    user_Icon: data.user_Icon
                })).unwrap()
                resolve(result)
                console.log(result)
               } catch (e) {
                reject(e)
               }
            }, 1000)
        })
        
        try {
            await callApi
            navigate("/Login")
        } catch (err) {
            console.log(err)
            navigate("/Register")
        }
        setShow(false)

    }
    
    return <div className="container">
      

        
        
            {/*<div className="move-right">
            <img className="logo-icon" src={logo} alt="Logo" />
</div>*/}
        <div className="loginSection">
        <div className="loginSectionContainer">
            
        
        <div className="move-center"><p>Welcome</p></div>
        <div className="move-center-icon"><img className="logo-icon-Large" src={logo} alt="Logo" /><div className="register-logo-name">出煮意</div></div>
        
        <div className="move-center">
            <form onSubmit={handleSubmit(onSubmit)}>
                <label>

                </label>

                <label>
                <div >  <input placeholder="用戶名" {...register('username') }/></div>
                </label>
                <br/>
                <label>
                <div > <input  placeholder="電郵" {...register('email')}/></div>
                </label>
                <br/>
                <label>  
                <div ><input type="password" placeholder="密碼" {...register('password')}/></div>
                </label>
                <br/>
                <div className="move-center"><button>註冊</button></div>
            </form>
           
        </div> 
            {/**<div>Display Name: {displayName}</div>

            <div>Error Msg : {errMsg}</div>

            <Loading show={show}/>**/}
        </div>
        </div>
    </div>
    
}