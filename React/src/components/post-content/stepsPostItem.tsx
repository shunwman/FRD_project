export default function temp() {
    
}

// import { useEffect, useState } from "react"
// import { useDispatch } from "react-redux"
// import { StepsPostItemState } from "../../redux/posting/postingSlice"
// import { fetchDeleteStepsItem, fetchGetStepsPostItems, fetchUpdateStepsPostItem } from "../../redux/posting/thunk"


// interface StepsPostItemsProps {
//     stepsPostItems: StepsPostItemsState
// }

// export default function IngredientsItems(props: StepsPostItemsProps) {
//     const dispatch = useDispatch()
//     let searchResult = window.location.search
//     let urlSeaParResult = new URLSearchParams(searchResult)
//     let recipePostId = urlSeaParResult.get("id")

//     const [stepsPostItemInput, setStepsPostItemInput] = useState<string>("")
//     const [stepsItemAmountInput, setIngredientsItemAmountInput] = useState<string>("")


//     const updateIngredientsPostItem = () => {


//         dispatch(fetchUpdateStepsPostItem({
//             recipeId: recipePostId,
//             // recipeId: props.ingredientsPostItems.recipeId,
//             id: props.stepsPostItems.id,
//             // ingredient_name: props.ingredientsPostItems.ingredient_name,
//             // quantity : props.ingredientsPostItems.quantity
//             ingredient_name: ingredientsPostItemInput || props.stepsPostItems.ingredient_name,
//             quantity: ingredientsItemAmountInput || props.stepsPostItems.quantity

//         }))
//     }

//     const deleteIngredientsItem = () => {
//         console.log("clicked, recipeId:", recipePostId, "& id:", props.stepsPostItems.id)
//         dispatch(fetchDeleteStepsItem({
//             recipeId: recipePostId,
//             id: props.stepsPostItems.id,

//         })).unwrap().then(() => {
//             dispatch(fetchGetStepsPostItems({
//                 recipeId: recipePostId
//             }))
//         })


//     }

//     return <div className="ingredientsPostItem">

//         <input className="ingredientsPostItemName"
//             defaultValue={props.stepsPostItems.ingredient_name}
//             // value={ingredientsPostItemInput}
//             // value={props.ingredientsPostItems.ingredient_name}
//             // value={ingredientsPostItemInput || props.ingredientsPostItems.ingredient_name}
//             onChange={(e) => setStepsPostItemInput(e.target.value)}
//             onBlur={updateStepsPostItem}
//         />

//         <input className="stepsPostItemQuantity"
//             defaultValue={props.stepsPostItems.quantity}
//             onChange={(e) => setStepsItemAmountInput(e.target.value)}
//             onBlur={updateStepsPostItem}
//         />

//         <div className="stepsPostItemDelete" onClick={deleteStepsItem}>X</div>

//     </div>
// }

