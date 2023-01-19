// import "../css/toDoList.css"
import  { useEffect,useState,useRef } from 'react'
import icon from "../assets/user.jpg"
import CommentItem from "./commentItem"
//user redux
//redux 
import {Avatar} from '@chakra-ui/react'
import { useDispatch } from "react-redux"
import store, { IRootState } from "../redux/store"
//redux for user 
import {fetchSendComment} from "../redux/user/thunk"

const useAppDispatch = () => useDispatch<typeof store.dispatch>()
interface userIdProps {
    
    userIcon : string
    username : string
    userId : number
    recipeId : number
    comment: any[]
}
export default function CommentList(props: userIdProps) { 
    const divRef : any = useRef(null);
    console.log(props.comment)
    
    const recipeComment = (props.comment).map((commentContent)=> {
        return {content: commentContent.content,
            user_icon : commentContent.user_icon,
            username :     commentContent.username   
            }
    })
    const dispatch = useAppDispatch()
    //console.log("uid:", props.userId , " rid:", props.recipeId)
    const [items, setItems] = useState<any[]>(recipeComment)
    const [scroll, setScroll] = useState(false)
    const [inputValue, setInputValue] = useState<string>("")
    useEffect(() => {
        if(scroll){
        divRef.current.scrollIntoView({ behavior: 'smooth' });
    }
      },[items]);

    const addItems = () => {
        if (inputValue !== ""){
    
        let newItem = [...items]
        newItem.push({
            content: inputValue,
            user_icon :props.userIcon,
            username : props.username})
                        
        setItems(newItem)
        setInputValue("")
        dispatch(fetchSendComment({userId: props.userId, recipeId: props.recipeId, content: inputValue, contentType: "textComment", imageName: "noImage"}))
        setScroll(true)
    }
    }

    const changeInputText = (value: string) => {
        setInputValue(value)
    } 
    return <div>
        <div >
         <div >
                {items.map((item: any, index: number) => {
                    return <div key={index}>
                        {<CommentItem content={item.content} user_icon = {item.user_icon} username= {item.username} key={index}  />}
                    </div>
                })}
        </div>

            <div className="comment-section">
            <div className="move-left">
           <textarea value={inputValue} onChange={(e) => changeInputText(e.target.value)} className="comment-text-area"></textarea>
            <div>
            
             <Avatar name={props.username} src={props.userIcon} />
            </div>
            </div>
            <div className="comment-submit-bar"><div className="move-right"><button onClick={addItems}  ref={divRef}>上傳訊息</button></div></div>
        </div> 
           
        </div>
    </div>
}