import { Button, ButtonGroup, Card, CardBody, CardFooter, Divider, Heading, slideFadeConfig, Spinner, Stack, useFocusEffect } from "@chakra-ui/react";
import { faPlus, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PostedRecipesItems from "../components/post-content/PostedRecipesItems";
import "../css/addrecipepage.css"
import { NewRecipeIdState, PostedRecipesItemsState, resetNewRecipeIdState } from "../redux/posting/postingSlice";
import { fetchGetPostedRecipes, fetchPostNewBlankRecipe } from "../redux/posting/thunk";
import store, { IRootState } from "../redux/store";

const delay = 0.5;


const useAppDispatch = () => useDispatch<typeof store.dispatch>()

export default function AddRecipePage() {
    const token = localStorage.getItem("token")
    let navigate = useNavigate();
    const newRecipeId: NewRecipeIdState = useSelector((state: IRootState) => state.posting.newRecipeId)
    const postedRecipesItems: PostedRecipesItemsState[] = useSelector((state: IRootState) => state.posting.postedRecipes)
    const isLoggedIn = useSelector((state: IRootState) => state.user.isLoggedIn)
    const numberOfPostedRecipes = postedRecipesItems.length  // <- change this logic
    const dispatch = useAppDispatch()
    const [newRecipeIdGot, setNewRecipeIdGot] = useState<any>(0)
    const [show, setShow] = useState(false);



    useEffect(() => {
        if (!token) {
            navigate("/login")
        }

        try {
            dispatch(
                fetchGetPostedRecipes()
            ).unwrap().then(() => {
                console.log("PostedRecipesItems:", postedRecipesItems)
            });
        } catch (e) {
            console.log(e)
        }
    }, [isLoggedIn])


    function getId() {
        setNewRecipeIdGot(newRecipeId)
        console.log("!! newRecipeId", newRecipeId)
    }

    useEffect(() => {
        let timer1 = setTimeout(() => setShow(true), delay * 1000);
        return () => {
            clearTimeout(timer1);
        };
    },[])
   
    return show ? (
    <div className="addRecipePageContainer">

        {/* {
             postedRecipesItems.filter(
             )
        } */}

        {
            postedRecipesItems[0] ? <div className="recipePostCount">你擁有{numberOfPostedRecipes}份食譜</div> : <div></div>
        }


        {
            postedRecipesItems[0] ? <div className="postedRecipesItemsContainer" >
                {
                    postedRecipesItems.map((postedRecipes: PostedRecipesItemsState) =>

                        <PostedRecipesItems key={postedRecipes.id} postedRecipesItems={postedRecipes} />

                    )
                }
            </div> : <div className="share-div">來分享你的食譜吧！</div>
        }


        <button className="addRecipeBtn" onClick={async () => {
            const callApi = new Promise<void>((resolve, reject) => {
                setTimeout(async () => {



                    try {
                        const result = await dispatch(
                            fetchPostNewBlankRecipe()
                        ).unwrap()
                        resolve(
                            // () => {}
                            // setNewRecipeIdGot(newRecipeId)
                            // navigate("/add-recipe-form-page?id=" + newRecipeId)
                            result
                        )
                        // console.log("result:", result)
                        navigate("/add-recipe-form-page?id=" + result)

                    } catch (e) {
                        reject(e)
                    }
                }, 800)
            })


            // navigateToRecipeFormPage() 

        }}>新增食譜<FontAwesomeIcon icon={faPlus} /></button>



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