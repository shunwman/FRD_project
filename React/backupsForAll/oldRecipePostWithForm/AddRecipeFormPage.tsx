import { Checkbox, Stack, Textarea, useFocusEffect } from "@chakra-ui/react"
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Select from "react-select";
import "../css/addRecipeFormPage.css"
import { fetchAddBlankIngredientsPostItems, fetchGetIngredientsPostItems, fetchPosting } from "../redux/posting/thunk";
import { IngredientsPostItemState } from "../redux/posting/postingSlice"
import store, { IRootState } from "../redux/store";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faRegular, faTrashCan} from '@fortawesome/free-solid-svg-icons'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { windowMockupColors } from "react-daisyui/dist/WindowMockup/WindowMockup";
import { get } from "fetch-mock";
import Temp from "../components/post-content/IngredientsPostItem";
import IngredientsItems from "../components/post-content/IngredientsPostItem";
//import { useQuery } from "react-query";


interface RecipeFormType {
    // imageNames: string[];
    recipeName: string;
    // recipeIntro: string;
    // isVegan: boolean;
    // servingSize: any;
    // durationMin: any;
    // ingredients: string[];
    // ingredients: JSON[]
    // servingSize: number;
    // durationMin: number;
}

const useAppDispatch = () => useDispatch<typeof store.dispatch>()

export default function AddRecipeFormPage() {

    const navigate = useNavigate()
    const isLoggedIn = useSelector((state: IRootState) => state.user.isLoggedIn)
    // const errMsg = useSelector((state: IRootState) => state.posting.errMsg)

    const ingredientsPostItems: IngredientsPostItemState[] = useSelector((state: IRootState) => state.posting.ingredients)
    console.log("ingredientsPostItems", ingredientsPostItems)

    const dispatch = useAppDispatch()
    // get recipe id from params
    let searchResult = window.location.search
    let urlSeaParResult = new URLSearchParams(searchResult)
    let recipePostId = urlSeaParResult.get("id")

    useEffect(() => {

        const token = localStorage.getItem("token")

        if (!token) {
            navigate("/login")
        }

        if (recipePostId) {
            console.log("recipePostId:", recipePostId)
        } else {
            console.log("error: missing recipe post id")
        }

        dispatch(fetchGetIngredientsPostItems({
            recipeId: recipePostId
        }))


        //Runs on every render
    }, []);

    const { register, handleSubmit } = useForm<RecipeFormType>({
        defaultValues: {
            // imageNames: [],
            recipeName: "",
            // recipeIntro: "",
            // isVegan: false,
            // servingSize: "",
            // durationMin: "",
            // ingredients: []

        }
    })

    const onSubmit = async (data: RecipeFormType) => {
        const callPostingApi = new Promise<void>((resolve, reject) => {
            setTimeout(async () => {
                try {
                    const postContent = await dispatch(fetchPosting({
                        // imageNames: data.imageNames,
                        recipeName: data.recipeName,
                        // recipeIntro: data.recipeIntro,
                        // isVegan: data.isVegan,
                        // servingSize: data.servingSize,
                        // durationMin: data.durationMin,
                        // ingredients: data.ingredients
                    })).unwrap()
                    resolve(postContent)
                } catch (e) {
                    reject(e)
                }
            }, 1000)
        })

        try {
            await callPostingApi
            // navigate("/")
            console.log("react sent successfully")
            navigate("/add-recipe-form-page")

        } catch (err) {
            console.log(err)
            navigate("/add-recipe-form-page")
        }
    }

    function addNewIngredientsInput() {
        console.log("clicked newIngredient")
        dispatch(fetchAddBlankIngredientsPostItems({
            recipeId: recipePostId
        })).unwrap().then(() => {
            dispatch(fetchGetIngredientsPostItems({
                recipeId: recipePostId
            }))
        })

    }


    // options for dropdown menus
    const option = [
        { value: "China", label: "China" },
        { value: "Japan", label: "??????" },
        { value: "Canada", label: "Canada" },
        { value: "Germany", label: "Germany" }
    ]

    return <div className="addRecipeFormContainer">
        {/* <Temp/> */}
        {/* follow example below */}
        <form className="postRecipeForm" onSubmit={handleSubmit(onSubmit)}>
            {/* <form> */}
            <div className="formPageHeader">
                ??????????????????
                <button className="uploadRecipeBtn">??????</button>

            </div>

            <div className="recipeForm">

                <Stack spacing={3} >

                    <input className="uploadMainImage"
                    // ref="file"
                    type="file"
                    name="???????????????"
                    />

                    

                    <input className="input-content" placeholder='?????????:' {...register('recipeName')} />

                    <Textarea className="recipeIntro" placeholder='????????????:' />

                    <Select options={option}
                        isClearable
                        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                        menuPortalTarget={document.body}
                        isSearchable={false}
                        name="color"
                        menuShouldScrollIntoView={false} />

                    <Checkbox>????????????</Checkbox>

                    <div className="servingSize">????????????:
                        <input className="unitInput" placeholder='??????' />
                        <div>???</div>
                    </div>

                    <div className="durationMin">????????????:
                        <input className="unitInput" placeholder='??????' />
                        <div>??????</div>
                    </div>

                    {/* <div className="durationMin">?????? (type [? mins])</div> */}

                </Stack>

                {/* <div className="servingSize">?????? (type & select)</div> */}

                <div className="ingredientsBorder">??????</div>

                <div className="ingredientsStack">



                    {
                        ingredientsPostItems.map((ingredients: IngredientsPostItemState) =>
                            <IngredientsItems key={ingredients.id} ingredientsPostItems={ingredients} />
                        )
                    }

                    {/* 
                    <div className="ingredients">

                        <input className="input-content" placeholder="??????" />

                        <input className="input-content" placeholder="??????" />
                        <FontAwesomeIcon onClick={deleteIngredient} icon={faTrashCan} />


                    </div>

                    <div className="ingredients">

                        <input className="input-content" placeholder="??????" />

                        <input className="input-content" placeholder="??????" />
                        <FontAwesomeIcon onClick={deleteIngredient} icon={faTrashCan} />
                        
                    </div> */}

                </div>

                <div className="addNewIngredients"
                    onClick={addNewIngredientsInput}
                >+ ????????????</div>


                <div className="stepsBorder">??????</div>


                <div className="stepsMotherContainer">

                    <div className="stepsContainer">

                        <div className="stepsSubContainer">

                            <div className="stepsNumber">[1]</div>

                            <div className="stepsMidSubContainer">

                                {/* <div className="stepsDescription"> */}
                                <input className="input-content stepsDescription" placeholder='????????????:' />

                                {/* ???????????? */}
                                {/* </div> */}

                                <div className="stepsPhoto">
                                    ????????????
                                </div>

                            </div>

                            <div>deleteBtn</div>

                        </div>


                    </div>


                </div>

                {/* add onClick */}
                <div className="addNewSteps">+ ????????????</div>



            </div>


        </form>

    </div>
}