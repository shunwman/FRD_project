import "../css/ProfileEditPage.css";
import { Spinner } from '@chakra-ui/react'
import Button from 'react-bootstrap/Button';
import React, { useState, FormEvent, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLeftLong } from '@fortawesome/free-solid-svg-icons'
import { Avatar, Input, Stack } from '@chakra-ui/react'
import image from "../assets/user.jpg"
import { useForm } from "react-hook-form";
import store, { IRootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserIcon } from "../redux/editUserProfile/thunk";
import { createEmitAndSemanticDiagnosticsBuilderProgram } from "typescript";
import { fetchGetMe, fetchIconEdit, fetchEditPage } from "../redux/user/thunk";
// import { fetchUserIcon } from "../redux/user/thunk";
// import { createSlice } from "@reduxjs/toolkit";
const delay = 0.5;
interface EditFormType {
  username: string
  email: string
  introduction: string
  // token: string
}
const token = localStorage.getItem("token")
const useEditDispatch = () => useDispatch<typeof store.dispatch>()
export default function ProfileEditPage() {

  const dispatch = useEditDispatch()
  const [show, setShow] = useState(false);
  const [showIcon, setShowIcon] = useState(true);
  // const editProfileSlice = createSlice
  // const [editValue, setEditValue] = useState<string>("")
  // const isLoggedIn = useSelector((state: IRootState) => state.user.isLoggedIn)
  // const [intervalId, setIntervalId] = useState<NodeJS.Timer>()
  // const userIcon = useSelector((state: IRootState) => state.user.userIcon)

  const [submit, changeSubmit] = useState("submit")
  const displayName = useSelector((state: IRootState) => state.user.displayName)
  const displayId = useSelector((state: IRootState) => state.user.displayId)
  const userIcon = useSelector((state: IRootState) => state.user.userIcon)
  const userEmail = useSelector((state: IRootState) => state.user.displayEmail)
  // const [icon, setIcon] = useState<any>(userIcon);
  const { register, handleSubmit, reset } = useForm<EditFormType>({
    defaultValues: {
      // password: "",
      introduction: "",
      username: displayName,
      email: userEmail,
      // describe: "",

    }
  })
  const [selectedFile, setSelectedFile] = useState(userIcon);
  // const [user, setUser]: any = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token")
    // setUser({
    //   // password: "",
    //   introduction: "",
    //   username: displayName,
    //   email: userEmail,
    //   // describe: "",

    // })
    let timer1 = setTimeout(() => setShow(true), delay * 1000);
    // dispatch(fetchGetMe({ token: token }))
    //Runs on every render
    if (token) {
      const fetchUser = async () => {
        // STEP 6：使用陣列的解構賦值把資料取出
        await dispatch(fetchGetMe({ token: token }))
        reset()
      }
      fetchUser();

    }
    return () => {
      clearTimeout(timer1);
    };
  }, [])


  // useEffect(() => {


  //   // setIcon(userIcon)
  //   // setSelectedFile(userIcon),
  //   reset()



  // }, [displayId]);

  const EditSubmit = async (data: EditFormType) => {
    console.log(selectedFile)
    const callApi = new Promise<void>((resolve, reject) => {
      setTimeout(async () => {
        try {
          const result = await dispatch(fetchEditPage({
            userId: displayId,
            icon: selectedFile,
            username: data.username,
            email: data.email,
            introduction: data.introduction
          })).unwrap()
          resolve(result)
        } catch (e) {
          reject(e)
        }
      }, 1000)
    })
    try {
      await callApi
      navigate("/profile")

      console.log("ok");

    } catch (err) {
      console.log(err)
      navigate("/profile-edit-page")
    }
  }


  let navigate = useNavigate();
  function leftBtn() {
    navigate("/profile");

  }
  const onSelectIcon = (event: { target: { files: any; value: string; }; }) => {
    const selectedFiles = event.target.files;
    const selectedFilesArray: any = Array.from(selectedFiles);
    setSelectedFile(selectedFilesArray[0])
    console.log(selectedFiles)
    event.target.value = "";
  }

  function changeIcon(e: any) {
    try {
      const selectedFiles = e.target.files;
      const selectedFilesArray: any = Array.from(selectedFiles);
      setSelectedFile(selectedFilesArray[0])
      let newIcon = URL.createObjectURL(e.target.files[0])
      console.log("new Url of image:", newIcon)
      // setIcon(newIcon)  Need to update for redux state
      // setShowIcon(false)
      //event.target.value = "";
    } catch (e) {
      console.log("no image received")
    }
  }
  // function submitIcon() {


  //   setShow(true)
  //   const callApi = new Promise<void>((resolve, reject) => {
  //     setTimeout(async () => {
  //       try {
  //         const result = await dispatch(fetchIconEdit({
  //           icon: selectedFile,
  //           userId: displayId
  //         })).unwrap()
  //         resolve(result)
  //         await dispatch(fetchGetMe({ token: token }))
  //       } catch (e) {
  //         reject(e)
  //       }
  //     }, 1000)
  //   })
  //   try {

  //     navigate("/profile")

  //     console.log("ok");

  //   } catch (err) {
  //     console.log(err)
  //     navigate("/profile-edit-page")
  //   }
  //   setShow(false)
  // }

  return show ? (

    <div className="container">

      {/* <div className="navbar">
      <Button type="button" className="return-btn" onClick={leftBtn}><FontAwesomeIcon icon={faLeftLong} size="2x" /></Button>
    </div> */}

      <div className="edit-content">
        <div className="top-content">
          <div className="edit-button-content">
            <Button type="button" className="return-btn" onClick={leftBtn}><FontAwesomeIcon icon={faLeftLong} size="2x" /></Button>
            <p className="position-solve">.</p>
          </div>

          <div className="edit-icon-content">
            <Avatar className="profile-icon" size='2xl' name={displayName} src={userIcon} />{' '}
            {showIcon ? <input type="file" accept="image/png , image/jpeg, image/webp" onChange={changeIcon} name="images" /> : <></>}
          </div>
          {/* <img src={icon} className="user-icon"/> */}
          {/* onChange={changeIcon}            <  replaced, may not ok  ^     */}
          {/* <input type="file" accept="image/*" onChange={changeIcon} /> */}
          {/*  ...register('user_icon')           <  replaced, may not ok  ^     */}
          可以這裡上載相片
        </div>

        <form className="edit-from" onSubmit={handleSubmit(EditSubmit)}>
          <div className="bottom-content">
            <Stack spacing={3}>
              <input className="input-content"
                //  onChange={(e) => } 
                placeholder='名字:' {...register('username')} />

              <input className="input-content" placeholder='Email:' {...register('email')} />
              <input className="input-content" placeholder='描述:' {...register('introduction')} />
            </Stack>
          </div>
          <Button type="submit" className="complete-btn">Complete</Button>

        </form>

      </div>
    </div>
  ) : (
    <div className="loader-cover"><Spinner
      thickness='4px'
      speed='0.65s'
      emptyColor='gray.200'
      color='red.500'
      size='xl'
    /></div>
  );



}

