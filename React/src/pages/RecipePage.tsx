import "../css/recipePage.css"
import Button from 'react-bootstrap/Button';
import React, { useEffect, useState, FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLeftLong, faSave, faHeart, faListUl } from '@fortawesome/free-solid-svg-icons'
import CommentList from '../components/commentList';//comment section
import icon from "../assets/user.jpg"
import testimage from "../assets/test.jpg"
import CookSnap from "./Test"
//redux 
import { useDispatch, useSelector } from "react-redux"
import store, { IRootState } from "../redux/store"
//redux for user 
import { fetchGetMe } from "../redux/user/thunk"
//redux for recipe 
import { RecipeIngredient, RecipeState } from "../redux/recipe/recipeSlice"
//get info of items and save function 
import { fetchGetRecipeItem, fetchSaveRecipe, fetchUnsaveRecipe, fetchSaveCheck } from "../redux/recipe/thunk"
//get info of items and like function 
import { fetchLikeRecipe, fetchUnLikeRecipe, fetchLikeCheck } from "../redux/recipe/thunk"
import { fetchRecipeComment } from "../redux/recipe/thunk"
import { Avatar, ButtonGroup, Card, CardBody, CardFooter, Divider, Heading, Stack, Image, Text } from '@chakra-ui/react'
const delay = 1;
const useAppDispatch = () => useDispatch<typeof store.dispatch>()
export default function RecipePage() {
  const dispatch = useAppDispatch()
  const [searchParams, setSearchParams] = useSearchParams();
  const recipeId = searchParams.get("id")
  // v check where does the user come from
  const userCameFrom = searchParams.get("from")
  const recipeStateItems: RecipeState = useSelector((state: IRootState) => state.recipe)
  const displayId: number = useSelector((state: IRootState) => state.user.displayId)
  const displayIcon: string = useSelector((state: IRootState) => state.user.userIcon)
  const displayName: string = useSelector((state: IRootState) => state.user.displayName)
  
  
  const [save, changeSave] = useState("save")
  //like btn 
  const [like, changeLike] = useState("like")
  const [numlike, changeNumlike] = useState(0)
  //cooksnap
  const [hideCookSnap, setHideCookSnap] = useState(true)
  const [photoReview, setReview] = useState(false)
  const token = localStorage.getItem("token")
  useEffect(() => {

    if (token) {
      const fetchUser = async () => {

        await dispatch(fetchGetMe({ token: token }))
      }
      fetchUser();


    }
    if (recipeId !== null) {
      const fetchComment = async () => {
        await dispatch(fetchGetRecipeItem({ id: parseInt(recipeId) }))
        const result: any = await dispatch(fetchRecipeComment({ recipeId: parseInt(recipeId) }))

      }
      fetchComment();
      console.log(recipeStateItems)
    }
  }, [])

  useEffect(() => {
    if (recipeStateItems.numOfLike && recipeStateItems.numOfLike.length > 0) {
      changeNumlike(parseInt(recipeStateItems.numOfLike[0].count ? recipeStateItems.numOfLike[0].count : 0))
    }
  }, [recipeStateItems])
  //when 
  useEffect(() => {
    if (displayId > 0) {
      const fetchCheck = async () => {
        const resultSave = await dispatch(fetchSaveCheck({ userId: displayId, recipeId: recipeId }))
        changeSave(resultSave.payload.message)
        const resultLike = await dispatch(fetchLikeCheck({ userId: displayId, recipeId: recipeId }))
        changeLike(resultLike.payload.message)
      }
      fetchCheck()
    }
  }, [displayId])

  let navigate = useNavigate();
  function leftBtn() {
    if (userCameFrom == "home") {

      navigate("/");
      return
    }
    if (userCameFrom == "profile") {

      navigate("/Login");
      return
    }
    navigate("/search-page");

  }
  function saveBtn() {

    if (save === "save") {

      changeSave("unsave")
      const res = dispatch(fetchSaveRecipe({ userId: displayId, recipeId: recipeId }))
      console.log("save: ", res);
    } else {
      console.log("unsave the items.");
      changeSave("save")
      const res = dispatch(fetchUnsaveRecipe({ userId: displayId, recipeId: recipeId }))
      console.log("unsave: ", res);
    }
  }

  function likeBtn() {
    if (like === "like") {
      changeNumlike(numlike + 1)
      changeLike("unlike")
      const res = dispatch(fetchLikeRecipe({ userId: displayId, recipeId: recipeId }))

      console.log("like: ", res);
    } else {
      console.log("unlike the items.");
      changeNumlike(numlike - 1);
      changeLike("like")

      const res = dispatch(fetchUnLikeRecipe({ userId: displayId, recipeId: recipeId }))
      console.log("unlike: ", res);
    }
  }
  function moreBtn() {
    console.log("go find more")
  }

  return recipeStateItems.name ? (

    <div className="container">
      <div className="navbar">
        <Button type="button" className="return-btn" onClick={leftBtn}><FontAwesomeIcon icon={faLeftLong} size="2x" /></Button>


        {token ? <div><span style={{ color: save === "unsave" ? "orange" : "black" }} onClick={saveBtn}><FontAwesomeIcon icon={faSave} size="2x" /></span>
          <span style={{ color: like === "unlike" ? "orange" : "black" }} onClick={likeBtn}><FontAwesomeIcon icon={faHeart} size="2x" /></span>
        </div> : <div></div>

        }



      </div>
      <div className="recipe-container">
        <div className="move-center"><img className="recipe-photo" src={recipeStateItems && recipeStateItems.image_names && recipeStateItems.image_names[0].image_name} alt="photo" /></div>
        {/**{recipeStateItems.numOfLike&&recipeStateItems.numOfLike.length&&<div className="recipe-name">{recipeStateItems.numOfLike[0].count}</div>}**/}
        <div className="recipe-name"><div>{recipeStateItems.name}</div>
          <div className="recipe-like"><FontAwesomeIcon icon={faHeart} />
            {numlike}</div></div>
        <div className="basic-information">
          {/**<div className="recipe-name">{recipeStateItems.name}</div>**/}
          <div className="user-data">
            <div className="avatar-div-icon"> <Avatar name={recipeStateItems.user.username} src={recipeStateItems.user.user_icon} /></div>
            <div>
              {recipeStateItems.user.username} <br /> {recipeStateItems.user.introduction ? recipeStateItems.user.introduction : "未有簡介"}
            </div>
          </div>

          <div className="recipe-summary basic-detail"><div> {recipeStateItems.description}</div></div>
          <div className="recipe-style basic-detail"> 分類: {recipeStateItems.cuisine_type} {recipeStateItems.isVegan ? "素食" : "非素食"}



          </div>
          <div className="Serving-size basic-detail">份量: {recipeStateItems.serving_size}人份</div>
          <div className="cooking-time basic-detail">時間： {recipeStateItems.duration_min}分鐘</div>

        </div>

        <div className="recipe-name">食材</div>
        <div className="ingredients-information">
          {/**<div className="recipe-name">食材</div>**/}
          <div className="ingredients-set">
            {
              recipeStateItems.recipeIngredients && (recipeStateItems.recipeIngredients).map((recipeIngredient, index) =>
                <ul key={index}>
                  <div className="ingredients-item"><div>{recipeIngredient.ingredient_name}</div><div>  {recipeIngredient.quantity}</div></div>
                </ul>)
            }
          </div>
        </div>

        <div className="recipe-name">烹調步驟</div>
        <div className="step-information">
          {
            recipeStateItems &&
            recipeStateItems.steps && (recipeStateItems.steps).map((step: any, index: number) =>
              <ul key={index}>
                <div className="step-item">
                  <div className="single-step">
                    <div className="step-number" >{index + 1}</div>
                    <div className="ingredients-item">
                      {step.step}
                    </div> </div>
                  {/**{step.image? (<img className="recipe-photo" src={`https://food-recipe-bucket.s3.ap-southeast-1.amazonaws.com/${step.image}`} alt="photo" />): <></>}**/}
                </div>
              </ul>
            )
          }


        </div>
        <div className="recipe-name">Cooksnap</div>
        <div className="cook-snap-information">
          <div className="body-container">

          </div>
          {!token ? ((recipeStateItems.recipeCookSnaps && recipeStateItems.recipeCookSnaps.length) ? <div className="scorll-cooksnap-container">
            {(recipeStateItems.recipeCookSnaps).map((cookSnap: any, index: number) =>
              <ul key={index}>
                <Card maxW='sm' key={index}>
                  <CardBody>
                    <Text>
                      <Avatar name={cookSnap.username} src={cookSnap.user_icon} />{cookSnap.username}<br />
                    </Text>
                    <Image
                      className="cooksnap-card-image"
                      src={cookSnap.image_name}
                      alt='Green double couch with wooden legs'
                      objectFit='cover'
                      borderRadius='lg'
                    />
                    <Stack mt='6' spacing='3'>

                      <Text>
                        {cookSnap.content}
                      </Text>

                    </Stack>
                  </CardBody>

                </Card>
              </ul>
            )}
          </div>
            : <div className="no-cooksnap-message">成為會員，分享你的成品照給大家吧</div>) : <></>}
          {token && recipeId && recipeStateItems && recipeStateItems.recipeCookSnaps && <CookSnap userId={displayId} username={displayName} recipeId={parseInt(recipeId)} userIcon={displayIcon} comment={recipeStateItems.recipeCookSnaps} />}


        </div>
        <div className="recipe-name">留言</div>

        {displayId && recipeId && recipeStateItems && recipeStateItems.recipeTextComments ? <CommentList userId={displayId} username={displayName} recipeId={parseInt(recipeId)} userIcon={displayIcon} comment={recipeStateItems.recipeTextComments} /> :
          <div className="no-cooksnap-message">成為會員，查看大家的留言吧</div>}




      </div>
    </div>
  ) : (
    <div>404 Not Found</div>
  );



}