import { useDispatch } from "react-redux"
import { useNavigate } from "react-router";
import { PostedRecipesItemsState } from "../../redux/posting/postingSlice"
import { Button, ButtonGroup, Card, CardBody, CardFooter, Divider, Heading, Stack, useFocusEffect } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
interface PostedRecipesItemsProps {
    postedRecipesItems: PostedRecipesItemsState
}

export default function PostedRecipesItems(props: PostedRecipesItemsProps) {
    // const dispatch = useDispatch()
    let navigate = useNavigate();

    function editTheRecipe() {
        // navigate("/add-recipe-form-page?id="+5)
        navigate("/add-recipe-form-page?id=" + props.postedRecipesItems.id)
    }

    // return <div className="post-item">
    //     <div className="posted-id"> <p>食譜:</p>{props.postedRecipesItems.name}</div>
    //     <div className="edit-btn" onClick={editTheRecipe}><p>更新你的食譜  </p><FontAwesomeIcon icon={faPlus} /></div>
    //     {props.postedRecipesItems.cover_image !== null ? <img className="post-img" src={props.postedRecipesItems.cover_image} /> : <div className="no-img">沒有封面圖 </div>}


    // </div>

    return <div>


        <Card className="post-item">

            <Card className="post-img-container">
            {props.postedRecipesItems.cover_image !== null ? <img className="post-img" src={props.postedRecipesItems.cover_image} /> : <div className="no-img">沒有封面圖 </div>}

            </Card>
            
            <div className="posted-title">

                <div className="name-heading">{props.postedRecipesItems.name ? props.postedRecipesItems.name: "無標題"}</div>
            
            </div>

            <div className="edit-btn" onClick={editTheRecipe}>更新你的食譜<FontAwesomeIcon icon={faPenToSquare} /></div>




        </Card>




    </div>



}