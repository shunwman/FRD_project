import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { clearInterval } from "timers"
import store, { IRootState } from "../redux/store"
import { fetchLogin } from "../redux/user/thunk"
import Loading from "./Loading"
import { useNavigate } from "react-router-dom";
import logo from "../assets/cooking.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle, faFacebook } from '@fortawesome/free-brands-svg-icons'
import { Spinner } from "@chakra-ui/react"
interface LoginFormType {
    username: string
    password: string
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
    const delay = 0.1
    useEffect(() => {
        let timer1 = setTimeout(() => setShow(true), delay * 1000);
        const token = localStorage.getItem("token")
        if (token) {
            clearTimeout(timer1);

            navigate("/user/profile")
        }
        //Runs on every render
    });
    const { register, handleSubmit } = useForm<LoginFormType>({
        defaultValues: {
            username: "",
            password: ""
        }
    })
    const navigateRegisterPage = () => {
        navigate("/register")
    }
    const onSubmit = async (data: LoginFormType) => {
        setShow(true)
        const callApi = new Promise<void>((resolve, reject) => {
            setTimeout(async () => {
                try {
                    const result = await dispatch(fetchLogin({
                        username: data.username,
                        password: data.password
                    })).unwrap()
                    resolve(result)
                } catch (e) {
                    reject(e)
                }
            }, 1000)
        })

        try {
            await callApi
            navigate("/user/profile")
        } catch (err) {
            console.log(err)
            navigate("/private/404")
        }
        setShow(false)

    }

    return show ? (
        <div className="container">

        <div className="loginSection">
            <div className="loginSectionContainer">


                <div className="move-center"><p>Welcome</p></div>
                <div className="move-center-icon"><img className="logo-icon-Large" src={logo} alt="Logo" /><div className="register-logo-name">出煮意</div></div>

                <div className="move-center">
                    <form className="loginForm" onSubmit={handleSubmit(onSubmit)}>
                        <label>
                           <div className="move-center"> <input placeholder="用戶名" {...register('username')} /></div>
                        </label>
                        <br />
                        <label>
                        <div className="move-center"> <input type="password" placeholder="密碼" {...register('password')} /></div>
                        </label>
                        <br />

                    </form>

                </div>
                <div className="move-center">
                    <form onSubmit={handleSubmit(onSubmit)}><button>登入</button></form>
                    <button onClick={navigateRegisterPage}>註冊</button>
                </div>

            </div>
        </div>
    </div>

    ) : (
        <div className="loader-cover"><Spinner
        thickness='4px'
        speed='0.65s'
        emptyColor='gray.200'
        color='red.500'
        size='x3'
      /></div>
    )
 

}
