import { Button, Checkbox, Stack, Textarea, useFocusEffect } from "@chakra-ui/react"
import { JSXElementConstructor, ReactElement, ReactFragment, ReactPortal, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Select from "react-select";
import "../css/addRecipeFormPage.css"
import { fetchAddBlankIngredientsPostItems, fetchGetIngredientsPostItems, fetchGetRecipeFormItems, fetchPosting, fetchPublishRecipeForm, fetchUpdateAllDataExceptIngredientsAndCover, fetchUploadCoverImage } from "../redux/posting/thunk";
import { IngredientsPostItemState, RecipeFormItemState, resetRecipeFormItemsState } from "../redux/posting/postingSlice"
import store, { IRootState } from "../redux/store";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faRegular, faTrashCan} from '@fortawesome/free-solid-svg-icons'
import { faPlus, faRightFromBracket, faTrashCan, faLongArrowAltUp, faLongArrowAltDown, faXmark, faLeftLong, faArrowUpFromBracket, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { windowMockupColors } from "react-daisyui/dist/WindowMockup/WindowMockup";
import { get } from "fetch-mock";
import Temp from "../components/post-content/IngredientsPostItem";
import IngredientsItems from "../components/post-content/IngredientsPostItem";
import { useSearchParams } from "react-router-dom";
import { Spinner } from '@chakra-ui/react'




const useAppDispatch = () => useDispatch<typeof store.dispatch>()
const delay = 0.2
interface RecipeFormItemProps {
    recipeFormItem: RecipeFormItemState
}

export default function AddRecipeFormPage() {
    const navigate = useNavigate()
    const cuisineTypeRef = useRef(null)
    const [searchParams, setSearchParams] = useSearchParams();
    const isLoggedIn = useSelector((state: IRootState) => state.user.isLoggedIn)
    // const errMsg = useSelector((state: IRootState) => state.posting.errMsg)
    const [show, setShow] = useState(false);

    const ingredientsPostItems: IngredientsPostItemState[] = useSelector((state: IRootState) => state.posting.ingredients)
    // console.log("ingredientsPostItems", ingredientsPostItems)

    const recipeFormItems: any = useSelector((state: IRootState) => state.posting.recipeFormItems)

    const [recipeSteps, setRecipeSteps] = useState<any>([])
    const [recipeFormCoverImage, setRecipeFormCoverImage] = useState<string>("")
    const [recipeFormNameInput, setRecipeFormNameInput] = useState<string>("")
    const [recipeFormDescriptionsInput, setRecipeFormDescriptionsInput] = useState<string>("")
    const [recipeFormCuisineType, setRecipeFormCuisineType] = useState<any>({})
    const [cuisineTypeId, setCuisineTypeId] = useState<any>(0)
    const [recipeFormIsVegan, setRecipeFormIsVegan] = useState<boolean>(false)
    const [recipeFormServingSize, setRecipeFormServingSize] = useState<any>("") // but should be number
    const [recipeFormDurationMin, setRecipeFormDurationMin] = useState<any>("")

    // vv problem here, don't use variable to store params
    let recipePostId = searchParams.get("id")
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(resetRecipeFormItemsState())
    }, [])

    useEffect(() => {
        if (recipeFormItems && recipeFormItems.isVegan) {
            setRecipeFormIsVegan(recipeFormItems.isVegan)
        }


    }, [recipeFormItems.isVegan])


    useEffect(() => {
        // console.log("isVegan state before", recipeFormIsVegan)
        if (recipeFormItems && recipeFormIsVegan) {
            // console.log("isVegan state", recipeFormIsVegan)
            updateAllDataExceptIngredientsAndCover()
        }


    }, [recipeFormIsVegan])


    // !!!!!!!!!do not use active function on passive useEffect
    useEffect(() => {
        if (recipeFormItems && cuisineTypeId) {
            updateAllDataExceptIngredientsAndCover()
        }
    }, [cuisineTypeId])

    useEffect(() => {
        if (recipeFormItems && recipeSteps) {
            updateAllDataExceptIngredientsAndCover()
        }
    }, [recipeSteps])

    useEffect(() => {

        if (recipeFormItems && recipeFormItems.steps) {
            let parsedSteps = recipeFormItems.steps
            setRecipeSteps(parsedSteps)
            console.log("parsedSteps:", parsedSteps, "type: ", typeof (parsedSteps))
        }

        setRecipeFormCoverImage(recipeFormItems.cover_image)
        setRecipeFormNameInput(recipeFormItems.name)
        setRecipeFormDescriptionsInput(recipeFormItems.descriptions)
        setRecipeFormCuisineType(option[recipeFormItems.cuisine_type_id - 1])
        setRecipeFormServingSize(recipeFormItems.serving_size)
        setRecipeFormDurationMin(recipeFormItems.duration_min)


    }, [recipeFormItems.steps]) // }, [recipeFormItems])

    useEffect(() => {
        console.log("fetchGetRecipeFormItems")
        const token = localStorage.getItem("token")

        if (!token) {
            navigate("/login")
        }

        if (recipePostId) {
            console.log("recipePostId:", recipePostId)
        } else {
            console.log("error: missing recipe post id")
        }

        dispatch(
            fetchGetRecipeFormItems({
                recipeId: searchParams.get("id")

            })
        )

        // get ingredients items
        dispatch(fetchGetIngredientsPostItems({
            recipeId: searchParams.get("id")
        }))


        return () => {
            dispatch(resetRecipeFormItemsState())
        }
        //Runs on every render
    }, [searchParams.get("id")]);


    // !!!!!!!!! to not use extra userEffects, follow the following function for each value:
    function updateAllDataExceptIngredientsAndCover(swappedRecipeSteps: any[] = []) {
        // console.log("cuisineTypeIdSorting:", cuisineTypeIdSorting, "state:", cuisineTypeId)
        console.log("cuisineTypeIdSorting:", "state:", cuisineTypeId)

        let allData = {
            recipeId: searchParams.get("id"),
            recipeName: recipeFormNameInput,
            recipeFormDescriptions: recipeFormDescriptionsInput,
            recipeFormCuisineType: cuisineTypeId ? cuisineTypeId : recipeFormItems.cuisine_type_id, // special state: extra
            recipeFormIsVegan: recipeFormIsVegan,
            recipeFormServingSize: recipeFormServingSize,
            recipeFormDurationMin: recipeFormDurationMin,
            recipeSteps: swappedRecipeSteps.length > 0 ? swappedRecipeSteps : recipeSteps
        }

        console.log("update All: ", allData);

        dispatch(fetchUpdateAllDataExceptIngredientsAndCover(
            allData
        ))
        console.log("updated", allData);

        // dispatch thunk
    }


    function james(swappedRecipeSteps: any[] = [], recipeFormIsVegan: boolean) {
        // console.log("cuisineTypeIdSorting:", cuisineTypeIdSorting, "state:", cuisineTypeId)
        console.log("cuisineTypeIdSorting:", "state:", cuisineTypeId)

        let allData = {
            recipeId: searchParams.get("id"),
            recipeName: recipeFormNameInput,
            recipeFormDescriptions: recipeFormDescriptionsInput,
            recipeFormCuisineType: cuisineTypeId ? cuisineTypeId : recipeFormItems.cuisine_type_id, // special state: extra
            recipeFormIsVegan: recipeFormIsVegan,
            recipeFormServingSize: recipeFormServingSize,
            recipeFormDurationMin: recipeFormDurationMin,
            recipeSteps: swappedRecipeSteps.length > 0 ? swappedRecipeSteps : recipeSteps
        }

        console.log("update All: ", allData);

        dispatch(fetchUpdateAllDataExceptIngredientsAndCover(
            allData
        ))
        console.log("updated", allData);

        // dispatch thunk
    }


    function publishRecipeForm() {
        dispatch(fetchPublishRecipeForm(
            {
                recipeId: searchParams.get("id"),
            }
        )).unwrap().then(() => {
            // navigate("/add-recipe-page")
            navigate("/")

        })
        // # db set to public , unwrap , use navigate (publish)
    }

    function returnBtn() {
        navigate("/add-recipe-page")
    }


    function deleteRecipeForm() {
        console.log("delete recipe")
    }

    function coverImageChanged(e: any) {
        try {
            let newUrl = URL.createObjectURL(e.target.files[0])
            console.log("new Url of image:", newUrl)
            setRecipeFormCoverImage(newUrl)
            // # send image to db for both recipes and recipe_images, after sending file to s3
            dispatch(fetchUploadCoverImage({
                recipeId: searchParams.get("id"),
                fileSent: e.target.files[0]
            }))


        } catch (e) {
            // console.log("no image received, e:", e)
            console.log("no image received")
        }
    }


    function addNewIngredientsInput() {
        console.log("clicked newIngredient")
        dispatch(fetchAddBlankIngredientsPostItems({
            recipeId: searchParams.get("id")
        })).unwrap().then(() => {
            dispatch(fetchGetIngredientsPostItems({
                recipeId: searchParams.get("id")
            }))
        })
    }

    function recipeNameInputChanged() {
        console.log("recipeNameInputChanged")
        // setRecipeFormNameInput()
        console.log(recipeFormNameInput)
        updateAllDataExceptIngredientsAndCover()
    }

    function recipeDescriptionsInputChanged() {
        // console.log(recipeDescriptionsInputChanged)
        // console.log(recipeFormDescriptionsInput)
        updateAllDataExceptIngredientsAndCover()
    }

    // options for dropdown menus
    const option = [
        { label: "加拿大" },
        { label: "澳門" },
        { label: "日本" },
        { label: "中國" },
        { label: "馬來西亞" },
        { label: "意大利" },
        { label: "法國" },
        { label: "印度" },
        { label: "台灣" },
        { label: "韓國" }
    ]

    function cuisineTypeChanged(e: any) {
        console.log("cuisineTypeChanged:", e)
        let cuisineTypeIdSorting
        if (!e) {
            setRecipeFormCuisineType({})
            cuisineTypeIdSorting = null
            setCuisineTypeId(cuisineTypeIdSorting)

        } else {
            setRecipeFormCuisineType(e)
            cuisineTypeIdSorting = option.indexOf(e) + 1
            setCuisineTypeId(cuisineTypeIdSorting)
        }
    }

    function handleIsVeganCheckBox() {

        // const newIsVegan = !recipeFormIsVegan

        console.log("isVegan checkbox clicked, from", recipeFormIsVegan, ", changed to: " + !recipeFormIsVegan)
        // setRecipeFormIsVegan(recipeFormIsVegan => !recipeFormIsVegan)
        setRecipeFormIsVegan(!recipeFormIsVegan)
        console.log("new-recipeFormIsVegan:", recipeFormIsVegan)

        // # vv add db logic here (isVegan)
        james(recipeSteps, !recipeFormIsVegan)
    }

    function recipeFormServingSizeChanged() {
        console.log("recipeFormServingSizeChanged")
        console.log(recipeFormServingSize)
        updateAllDataExceptIngredientsAndCover()
    }

    function recipeFormDurationMinChanged() {
        console.log("recipeFormDurationMinChanged")
        console.log(recipeFormDurationMin)
        updateAllDataExceptIngredientsAndCover()
    }

    function updateCuisineType(cuisine_id: any) {
        console.log("cuisine_id:", cuisine_id + 1)
        // dispatch(
        //     fetchUpdateCuisineType({
        //         cuisine_id: cuisine_id
        //     })
        // )
        updateAllDataExceptIngredientsAndCover()
    }

    function stepsDescriptionTextChanged() {
        console.log("stepsDescriptionTextChanged")
        console.log(recipeSteps)
    }

    // for steps array
    const swapArrayPositions = (array: any[], a: number, b: number) => {
        // let newArray: any[] = [...array];

        // [newArray[a], newArray[b]] = [newArray[b], newArray[a]];
        [array[a], array[b]] = [array[b], array[a]];

        return array
    }

    function stepSwapping(indexA: number, indexB: number) {

        if (indexA > indexB) {
            console.log("moving up: from", indexA, "to", indexB)
        } else if (indexA < indexB) {
            console.log("moving down: from", indexA, "to", indexB)
        }

        // console.log("content:", content)
        let originalRecipeSteps = [...recipeSteps];
        console.log("the original steps array:", originalRecipeSteps);
        let swappedRecipeSteps = swapArrayPositions(originalRecipeSteps, indexA, indexB);
        setRecipeSteps(swappedRecipeSteps)
        console.log("the new steps array:", swappedRecipeSteps);
        // # add function to update the steps
        updateAllDataExceptIngredientsAndCover(swappedRecipeSteps)

    }

    const deleteArrayItem = function (array: any[], index: number) {
        return array.filter((_, i) => i !== index)
    }

    function deleteTheStep(index: number) {
        console.log("the original steps array:", recipeSteps)
        console.log("delete:", index)
        let newRecipeSteps = deleteArrayItem(recipeSteps, index)
        setRecipeSteps(newRecipeSteps)
        console.log("the new steps array:", recipeSteps)

        updateAllDataExceptIngredientsAndCover()
    }


    function addNewStepsButton() {
        // console.log(parsedSteps.length)
        console.log("original recipeSteps:", recipeSteps)
        let newSteps = [...recipeSteps]
        newSteps.push({ step: "", image: "" })
        console.log(newSteps)
        setRecipeSteps(newSteps)
        console.log("recipeSteps after new set:", recipeSteps)

        updateAllDataExceptIngredientsAndCover(newSteps)
    }

    let timer1 = setTimeout(() => setShow(true), delay * 1000);
    useEffect(() => {
        let timer1 = setTimeout(() => setShow(true), delay * 1000);
        return () => {
            clearTimeout(timer1);
        };
    }, [])



    return show ? (

        <div className="addRecipeFormContainer">

            <div className="formPageHeader">
                <div className="uploadRecipeBtn" onClick={returnBtn}><FontAwesomeIcon icon={faLeftLong} /></div>

                上傳你的食譜
                <div className="uploadRecipeBtn"
                    onClick={publishRecipeForm}
                >發佈</div>

            </div>

            <div className="recipeForm">

                <Stack spacing={3} >

                    <div className="upload-image-container">
                        {recipeFormCoverImage ? <img className="uploadMainImage" src={recipeFormCoverImage} /> : <></>}
                        <div className="position-solve-div">
                            <label className="uploadImageInput">
                                <input className="uploadInput" defaultValue="" type="file" name="上傳封面照" onChange={coverImageChanged} />
                                <div className="uploadInput-content"><FontAwesomeIcon icon={faArrowUpFromBracket} size="1x" className="upload-cover-img" /><p>上傳封面照</p></div>
                            </label>

                        </div>

                    </div>


                    <input className="recipeName"
                        // value={recipeFormItems[0].name}
                        // defaultValue={recipeFormItems.name || recipeFormNameInput}
                        defaultValue={recipeFormNameInput}
                        placeholder='食譜名:'
                        onChange={(e) => setRecipeFormNameInput(e.target.value)}
                        onBlur={recipeNameInputChanged}
                    />

                    <Textarea className="recipeIntro"
                        defaultValue={recipeFormDescriptionsInput}
                        placeholder='食譜介紹:'
                        onChange={(e) => setRecipeFormDescriptionsInput(e.target.value)}
                        onBlur={recipeDescriptionsInputChanged}
                    />

                    <Select

                        options={option}
                        ref={cuisineTypeRef}
                        defaultValue={option[-1]}
                        // defaultValue={null}
                        isClearable

                        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                        menuPortalTarget={document.body}
                        isSearchable={true}
                        name="color"
                        theme={(theme) => ({
                            ...theme,
                            colors: {
                                ...theme.colors,
                                text: "black",
                                primary25: "#d6fdf7",
                                primary: "#FFBB3E",
                                primary50: "#d6fdf7"
                            }
                        })}

                        menuShouldScrollIntoView={false}
                        value={recipeFormCuisineType}
                        onChange={(e) => {
                            cuisineTypeChanged(e)

                        }

                        }


                    />

                    <div className="isVeganCheckBox">
                        <input className="input-box"
                            // defaultChecked={recipeFormIsVegan}
                            type="checkbox"
                            checked={recipeFormIsVegan}
                            onChange={() => handleIsVeganCheckBox()}
                        />
                        是否素食

                    </div>


                    <div className="servingSize">食用份量:
                        <input className="unitInput"
                            type="number"
                            defaultValue={recipeFormServingSize}
                            onChange={(e) => setRecipeFormServingSize(e.target.value)}
                            onBlur={recipeFormServingSizeChanged}
                            placeholder='數字' />
                        <div>人</div>
                    </div>

                    <div className="durationMin">烹飪需時:
                        <input className="unitInput"
                            type="number"
                            defaultValue={recipeFormDurationMin}
                            onChange={(e) => setRecipeFormDurationMin(e.target.value)}
                            onBlur={recipeFormDurationMinChanged}
                            placeholder='數字' />
                        <div>分鐘</div>
                    </div>

                    {/* <div className="durationMin">需時 (type [? mins])</div> */}

                </Stack>

                {/* <div className="servingSize">份量 (type & select)</div> */}

                <div className="ingredientsBorder">食材</div>

                <div className="ingredientsStack">

                    {
                        ingredientsPostItems.map((ingredients: IngredientsPostItemState) =>
                            <IngredientsItems key={ingredients.id} ingredientsPostItems={ingredients} />
                        )
                    }

                </div>

                <div className="addNewIngredients"
                    onClick={addNewIngredientsInput}
                >新增食材 <FontAwesomeIcon icon={faPlus} /></div>


                <div className="stepsBorder">步驟</div>

                <Stack spacing={3} className="outside-step-container">

                    {recipeSteps && recipeSteps.length > 0 && recipeSteps.map((content: any, index: any, recipeFormItem: RecipeFormItemState, props: RecipeFormItemProps) =>
                        <div className="step-container" key={content.step || index} >

                            <div className="step-top-container">步驟{index + 1}
                                <div className="deleteStep" onClick={() =>
                                    deleteTheStep(index)
                                }>
                                    <FontAwesomeIcon icon={faXmark} />
                                </div>

                            </div>
                            <div className="step-main-container">

                                {content &&
                                    <Textarea

                                        defaultValue={content.step}
                                        className="stepInput-container"
                                        onBlur={(e) => {

                                            let oldSteps: any[] = [...recipeSteps]
                                            console.log("oldSteps:", oldSteps[index].step)
                                            let newSteps: any[] = []

                                            for (let i = 0; i < oldSteps.length; i++) {
                                                // newSteps[i].step=e.target.value
                                                newSteps[i] = {}
                                                newSteps[i].step = oldSteps[i].step
                                            }
                                            newSteps[index].step = e.target.value

                                            console.log("newSteps:", newSteps[index])
                                            console.log("newSteps:", newSteps)

                                            setRecipeSteps(newSteps)

                                        }}

                                    />}

                                <div className="stepBtnContainer">

                                    <div className="stepMoveBtn" onClick={() =>
                                        (index !== 0) ?
                                            stepSwapping(index, (index - 1))
                                            : console.log("You can't move the first item.")

                                    }>
                                        {(index !== 0) ? <div><FontAwesomeIcon icon={faLongArrowAltUp} /></div> : ""}
                                    </div>
                                    <div className="stepMoveBtn" onClick={() =>

                                        (index + 1 !== recipeSteps.length) ?
                                            stepSwapping(index, (index + 1))
                                            : console.log("You can't move the last item.")
                                    }>
                                        {(index + 1 !== recipeSteps.length && recipeSteps.length !== 1) ? <div><FontAwesomeIcon icon={faLongArrowAltDown} /></div> : ""}
                                    </div>


                                </div>

                            </div>




                        </div>
                    )}


                </Stack>

                <div className="addNewSteps"
                    onClick={addNewStepsButton}
                >新增步驟 <FontAwesomeIcon icon={faPlus} /></div>

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