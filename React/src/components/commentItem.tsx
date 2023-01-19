
import { useState } from "react"
import icon from "../assets/user.jpg"
import {Avatar} from '@chakra-ui/react'
interface CommentItemProps {
  content: string
  user_icon: string
  username: string
}

export default function CommentItem(props: CommentItemProps) {

    return <div><div className="comment-section">
      
    <div className="move-left">
    <Avatar name={props.username} src={props.user_icon} />
    <div>
    <div className="move-left">{props.username}</div>
    <div className="comment-text-area">{props.content} </div>
    </div>
    </div>
  </div> 
    </div>
}