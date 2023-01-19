import "../css/profile.css"
import Radio from '@mui/material/Radio';
import image from "../assets/user.jpg"
import Collection from "../components/profile-content/Collection"
import MyRecipe from "../components/profile-content/MyRecipe"
import ProfileEditPage from "./ProfileEditPage";
import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Spinner } from '@chakra-ui/react'


import "@fortawesome/fontawesome-free/css/all.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "../redux/store";
import CenterTab from "../components/profile-content/ChangeMode";
import { ProfileRecipeItemState, ProfileRecipeItemStatus } from "../redux/profileRecipe/profileRecipeSlice";
import { fetchGetRecipeItem, fetchSaveCheck } from "../redux/recipe/thunk";
import { fetchGetMe, fetchLogout } from "../redux/user/thunk"
import { fetchGeCollectionItems, fetchGetMyRecipeItems } from "../redux/profileRecipe/thunk"
import { Avatar } from "@chakra-ui/react";


const delay = 0.5;


export default function Profile() {
    // const displayEmail = useSelector((state: IRootState) => state.user.displayEmail)
    // const fetchGetSavedPosts: FetchGetSavedPosts[] = useSelector(state: IRootState) => state.posting.ingredients)
    // const myRecipeItems: ProfileRecipeItemState[] = useSelector((state: IRootState) => state.profile.myRecipeItems)
    // const collectionItems: ProfileRecipeItemState[] = useSelector((state: IRootState) => state.profile.collectionItems)
    const [show, setShow] = useState(false);



    const token = localStorage.getItem("token")
    useEffect(() => { // const displayId: number = useSelector((state: IRootState) => state.user.displayId)
        let timer1 = setTimeout(() => setShow(true), delay * 1000);




        if (token) {
            const fetchUser = async () => {
                // STEP 6：使用陣列的解構賦值把資料取出
                await dispatch(fetchGetMe({ token: token }))
            }
            fetchUser();

        }
        return () => {
            clearTimeout(timer1);

        };
    }, [])


    const displayName = useSelector((state: IRootState) => state.user.displayName)
    const displayId = useSelector((state: IRootState) => state.user.displayId)
    const userIcon = useSelector((state: IRootState) => state.user.userIcon)

    useEffect(() => {

        if (displayId > 0) {
            const fetchCheckCollection = async () => {
                const resultDone = await dispatch(fetchGetMyRecipeItems({ userId: displayId }))

                const resultSave = await dispatch(fetchGeCollectionItems({ userId: displayId }))


            }
            fetchCheckCollection()
        }
    }, [displayId])








    const dispatch = useDispatch()
    const searchMode: ProfileRecipeItemStatus = useSelector((state: IRootState) => state.profile.searchMode)
    const [save, changeSave] = useState("unsave")
    function logoutUser() {
        dispatch(fetchLogout())
        editPage('/')
    }

    let editPage = useNavigate();
    function navigateEditPage() {
        editPage('/profile-edit-page')
    }






    return show ? (

        <div className="container">
            <div className="profile-container">

                <div className="user-info">
                    <div className="logout-content">
                        <p className="position-solve">.</p>
                        <button className="logout-btn" onClick={logoutUser}><FontAwesomeIcon icon={faRightFromBracket} size="2x" /></button>
                    </div>

                    <Avatar className="profile-icon" size='2xl' name={displayName} src={userIcon} />{' '}

                    <div className="info-content">
                        <div className="user-name">{displayName}</div>
                        {/* <div className="user-content">Email :{displayEmail}</div> */}

                        <div>
                            <button className="edit-button" onClick={navigateEditPage}><FontAwesomeIcon icon={faPenToSquare} size="2x" /></button>

                        </div>

                    </div>

                </div>

                {displayId ?
                    <div>
                        <CenterTab userId={displayId} />
                        <div className="select-container">
                            {searchMode == ProfileRecipeItemStatus.Collection || <Collection />}
                            {searchMode == ProfileRecipeItemStatus.MyRecipe || <MyRecipe />}
                        </div>
                    </div> : <></>
                }
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
    )

}