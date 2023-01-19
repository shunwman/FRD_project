//import { useState, useEffect } from "react";
//
//const delay = 5;
//
//export default function App() {
//  const [show, setShow] = useState(false);
//
//  useEffect(
//    () => {
//      let timer1 = setTimeout(() => setShow(true), delay * 1000);
//
//      // this will clear Timeout
//      // when component unmount like in willComponentUnmount
//      // and show will not change to true
//      return () => {
//        clearTimeout(timer1);
//      };
//    },
//    // useEffect will run only one time with empty []
//    // if you pass a value to array,
//    // like this - [data]
//    // than clearTimeout will run every time
//    // this value changes (useEffect re-run)
//    []
//  );
//
//  return show ? (
//    <div>show is true, {delay}seconds passed</div>
//  ) : (
//    <div>show is false, wait {delay}seconds</div>
//  );
//}

//import React from "react";
//import { useForm } from "react-hook-form";

//import CommentList from '../components/commentList';
//import Select from "react-select";import "../css/recipePage.css"
import { useEffect, useState } from "react";
import store from "../redux/store";
import { useDispatch, useSelector } from "react-redux"
import { fetchSendCookSnap} from "../redux/user/thunk"

import {Avatar, ButtonGroup, Card, CardBody, CardFooter, Divider, Heading, Stack, Image, Text} from '@chakra-ui/react'
const useAppDispatch = () => useDispatch<typeof store.dispatch>()
interface userIdProps {
    
  userIcon : string
  username : string
  userId : number
  recipeId : number
  comment: any[]
}
export default function CookSnap(props: userIdProps) {
  const recipeComment = (props.comment).map((commentContent)=> {
    return {content: commentContent.content,
        user_icon : commentContent.user_icon,
        username :     commentContent.username,
        image_name: commentContent.image_name
           }
})

  const [selectedImages, setSelectedImages] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [selectedText, setSelectedText] = useState("")
  const [showAddCookSnap, setShow] = useState(true)
  const [hideCookSnap, setHideCookSnap] = useState(true)
  const dispatch = useAppDispatch()
  const [items, setItems] = useState<any[]>(recipeComment)
  const onSelectFile = (event: { target: { files: any; value: string; }; }) => {
    const selectedFiles = event.target.files;
    const selectedFilesArray : any = Array.from(selectedFiles);
    setSelectedFile(selectedFilesArray[0])
    setSelectedImages(URL.createObjectURL(selectedFilesArray[0]));
    
    // FOR BUG IN CHROME
    event.target.value = "";
    setShow(false)
  };
   function uploadFile() {
    
   
    console.log("commentText: ", selectedText,
      "commentImage: ", selectedFile)
      const fetchCheck= async() => { 
       const  result = await dispatch(fetchSendCookSnap({
          userId: props.userId,
          recipeId: props.recipeId,
          contentType: "cooksnap",
          content: selectedText,
          image: selectedFile 
        }))
        console.log(result.payload.message)
         let newItem = [...items]
       newItem.unshift({
      content: selectedText,
      user_icon : props.userIcon,
      username :     props.username,
      image_name: result.payload.message
    })
    setItems(newItem)
      
      
      
      }
        fetchCheck();
        setSelectedImages("");
        setSelectedText("");
       setHideCookSnap(true)
        setShow(true)
  }

  function deleteHandler(image:any) {
    setSelectedImages("");
    setSelectedText("");
    URL.revokeObjectURL(image);
    setShow(true)
    
  }

  return (<div>
    {      hideCookSnap&&items&&(items.length !== 0)&&
          <div className="scorll-cooksnap-container">
          {(items).map((item: any, index: number) =>
          
          
                    <ul key={index}>
                    <Card maxW='sm' key={index}>
                  <CardBody>
                    <Avatar name={item.username} src={item.user_icon} />{" "+item.username}
                    
                    
                  <Image
                    className="cooksnap-card-image"
                    src={item.image_name}
                    alt='Green double couch with wooden legs'
                    borderRadius='lg'
                    objectFit='cover'
                    />
                  <Stack mt='6' spacing='3'>
            
                    <Text>
                    {item.content}
                    </Text>
                    
                    </Stack>
                    </CardBody>
          
                    </Card>
                    </ul>
          
                
          
          
          
          
          )

          
          } 
          </div>
    }

          {items&&!items.length&&<div className="no-cooksnap-message">分享你的成品照給大家吧</div>}


    <section className = "section-cooksnap">
    
        {selectedImages &&(     
              <div key={selectedImages} className="image"> 
              
              <button className="cooksnap-error" onClick={() => deleteHandler(selectedImages)}>
                  delete image
                </button>
             <div className="cooksnap-images">  
                <img src={selectedImages} height="400" alt="upload" />
              </div>
                <input placeholder="comment" className="cooksnap-error-input" name="commentText" value={selectedText} onChange={(e) => setSelectedText(e.target.value)}/>
              </div>
             
            )
          }
   
      {showAddCookSnap&&!hideCookSnap&&
      <label className="label-cooksnap">
        + Add Images
        <br />
        <span></span>
        <input
          className="no-view-input"
          type="file"
          name="images"
          onChange={onSelectFile}
          accept="image/*"
        />
      </label>
      }
      <br />
      {selectedImages && <button className="upload-btn" onClick={uploadFile}>UPLOAD IMAGE</button>
        }
         { <div className="move-center"> {hideCookSnap? <button onClick={() =>setHideCookSnap(false)}>上傳到Cooksnap</button>: <button onClick={() =>setHideCookSnap(true)}>返回</button>} </div>}
    </section></div>
  );
        }

        
//  const [value, setValue] = useState("");
//
//  const reset = () => {
//    setValue("");
//  };
//{hideCookSnap ? ( (recipeStateItems.recipeCookSnaps && recipeStateItems.recipeCookSnaps.length) ? <div className="scorll-cooksnap-container">
  //      {(recipeStateItems.recipeCookSnaps).map((cookSnap: any, index: number) =>
   //     <div className="cooksnap-container" key={index}>
  ////      <img className="recipe-photo" src={cookSnap.image_name} alt="photo" />
 //       {cookSnap.username}<br/>
 //       {cookSnap.content}<br/>
   //     </div>)} 
   //     </div>
//  const handleSelectChange = (selected: any) => {
//    setValue(selected);
//    console.log(selected)
//  };
//
//  return (
//    <div>
//    
//      <Select
//        className="drop-down"
//        options ={data?.map((data: any, index: number) => ({
//          value: data.username,
//          label: data.username,
//          id: index
//        }))}
//        name="user"
//        value={value} // <---- CHANGE HERE
//        onChange={handleSelectChange}
//        placeholder="User Name"
//        theme={(theme) => ({
//          ...theme,
//          colors: {
//            ...theme.colors,
//            text: "black",
//            primary25: "#d6fdf7",
//            primary: "#0bb7a7",
//            primary50: "#d6fdf7"
//          }
//        })}
//      ></Select>
//
//      <button
//        className="dash-button-1"
//        type="submit"
//        
//        onClick={reset}
//      >
//        Reset
//      </button>
//    </div>
//  );
//}
