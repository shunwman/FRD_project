import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { IngredientsPostItemState } from "../../redux/posting/postingSlice"
import { fetchDeleteIngredientsItem, fetchGetIngredientsPostItems, fetchUpdateIngredientsPostItem } from "../../redux/posting/thunk"

interface IngredientsPostItemProps {
    ingredientsPostItems: IngredientsPostItemState
}

export default function IngredientsItems(props: IngredientsPostItemProps) {
    const dispatch = useDispatch()
    let searchResult = window.location.search
    let urlSeaParResult = new URLSearchParams(searchResult)
    let recipePostId = urlSeaParResult.get("id")

    const [ingredientsPostItemInput, setIngredientsPostItemInput] = useState<string>("")
    const [ingredientsItemAmountInput, setIngredientsItemAmountInput] = useState<string>("")

    // useEffect(() => {
    // })

    const updateIngredientsPostItem = () => {


        dispatch(fetchUpdateIngredientsPostItem({
            recipeId: recipePostId,
            // recipeId: props.ingredientsPostItems.recipeId,
            id: props.ingredientsPostItems.id,
            // ingredient_name: props.ingredientsPostItems.ingredient_name,
            // quantity : props.ingredientsPostItems.quantity
            ingredient_name: ingredientsPostItemInput || props.ingredientsPostItems.ingredient_name,
            quantity: ingredientsItemAmountInput || props.ingredientsPostItems.quantity

        }))
    }

    const deleteIngredientsItem = () => {
        console.log("clicked, recipeId:", recipePostId, "& id:", props.ingredientsPostItems.id)
        dispatch(fetchDeleteIngredientsItem({
            recipeId: recipePostId,
            id: props.ingredientsPostItems.id,

        })).unwrap().then(() => {
            dispatch(fetchGetIngredientsPostItems({
                recipeId: recipePostId
            }))
        })


    }

    return <div className="ingredientsPostItem">

        <input className="ingredientsPostItemName"
            defaultValue={props.ingredientsPostItems.ingredient_name}
            placeholder="食材名稱"
            // value={ingredientsPostItemInput}
            // value={props.ingredientsPostItems.ingredient_name}
            // value={ingredientsPostItemInput || props.ingredientsPostItems.ingredient_name}
            onChange={(e) => setIngredientsPostItemInput(e.target.value)}
            onBlur={updateIngredientsPostItem}
        />

        <input className="ingredientsPostItemQuantity"
            defaultValue={props.ingredientsPostItems.quantity}
            placeholder="份量"
            onChange={(e) => setIngredientsItemAmountInput(e.target.value)}
            onBlur={updateIngredientsPostItem}
        />

        <div className="ingredientsPostItemDelete" onClick={deleteIngredientsItem}><FontAwesomeIcon icon={faXmark}/></div>

    </div>
}

