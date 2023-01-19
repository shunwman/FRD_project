import "../../css/profileContent.css"
import image from "../../assets/recipe01a.jpg"
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import store, { IRootState } from "../../redux/store";
import { MyCollectionItemState, ProfileRecipeItemState } from "../../redux/profileRecipe/profileRecipeSlice";
import { BrowserRouter, Link, Routes } from 'react-router-dom';
interface GetSavedPosts {
    recipe_id: number;
    user_id: number;

}

const useEditDispatch = () => useDispatch<typeof store.dispatch>()
export default function Collection() {
    const collectionItems: MyCollectionItemState[] = useSelector((state: IRootState) => state.profile.collectionItems)
    // const collectionImages: MyCollectionItemState[] = useSelector((state: IRootState) => state.profile.collectionItems)
    const dispatch = useEditDispatch()

    let navigate = useNavigate();


    function recipePage() {
        navigate("/recipe-page/*");
    }

    return <div className="select-content">

        {
            collectionItems.map((item, index) => (
               <Link to={"/recipe-page/?id="+item.recipe_id+"&from=profile"} className="recipe-content-link" key={index} >
                <div className="recipe-content" >
                    <img className="recipe-img" src={item && item.cover_image ? item.cover_image : ''} alt="photo" />
                    <div className="post-name">{item.name}</div>
                </div> 
                </Link>
               
            ))
        }

 {/**<
                **/}
    </div>




}