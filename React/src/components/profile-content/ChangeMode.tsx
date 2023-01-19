import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { ProfileRecipeItemStatus } from "../../redux/profileRecipe/profileRecipeSlice"
import { fetchGeCollectionItems, fetchGetMyRecipeItems } from "../../redux/profileRecipe/thunk"
import { IRootState } from "../../redux/store"
interface userIdProps {
    userId : number
}
export default function CenterTab(props: userIdProps) {
    const searchMode = useSelector((state:IRootState) => state.profile.searchMode)
    const dispatch = useDispatch()
    const fetchCollection = ()=> {
        dispatch(fetchGeCollectionItems({ userId: props.userId}))

    }

    const fetchMyRecipe = ()=> {
        dispatch(fetchGetMyRecipeItems({ userId: props.userId}))
 
    }
   {/*  useEffect(() => {
     
        dispatch(fetchGetMyRecipeItems({ userId: props.userId}))
        dispatch(fetchGeCollectionItems({ userId: props.userId}))
    },[])**/}
    return <div className="center-container">
        <div className="center-group">
            <div id="center-tab"  className={searchMode == ProfileRecipeItemStatus.Collection ? 'active' : ''} onClick={() => fetchCollection()}>我的食譜</div>
            <div id="center-tab" className={searchMode == ProfileRecipeItemStatus.MyRecipe ? 'active' : ''} onClick={() => fetchMyRecipe()}>我的收藏</div>
        </div>

    </div>
}