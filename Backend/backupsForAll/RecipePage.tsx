import "../css/recipePage.css"
import Button from 'react-bootstrap/Button';
import React, { useEffect,useState, FormEvent } from 'react'
import { useNavigate,useSearchParams } from 'react-router-dom';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLeftLong, faSave, faCamera, faListUl } from '@fortawesome/free-solid-svg-icons'
import { Input, Stack } from '@chakra-ui/react'
import recipe from "../assets/fried_beef.jpg"
import icon from "../assets/user.jpg"
//redux for recipe
import { useDispatch, useSelector } from "react-redux"
import { fetchGetRecipeItem } from "../redux/recipe/thunk"
import {  RecipeIngredient, RecipeState } from "../redux/recipe/recipeSlice"
import { IRootState } from "../redux/store"






export default function RecipePage() { 
const dispatch = useDispatch()
const [searchParams, setSearchParams] = useSearchParams();
const id = searchParams.get("id")
const recipeStateItems: RecipeState  = useSelector((state: IRootState) => state.recipe)

  useEffect(() => {
    if(id !== null){
    dispatch(fetchGetRecipeItem({id: parseInt(id)}))
  }
}, [])

    let navigate = useNavigate();
    function leftBtn() {
      navigate("/search-page");
    }
    function saveBtn() {
      console.log("save the items.")
    }
    function snapBtn() {
        console.log("to the cook snap .")
      }
      function moreBtn() {
        console.log("go find more")
      }

    return <div className="container">

    <div className="navbar">
      <Button type="button" className="return-btn" onClick={leftBtn}><FontAwesomeIcon icon={faLeftLong} size="2x" /></Button>
      
      <div>
      <span onClick={saveBtn}><FontAwesomeIcon icon={faSave} size="2x"/></span>
      <span onClick={snapBtn}><FontAwesomeIcon icon={faCamera} size="2x"/></span>
      <span onClick={moreBtn}><FontAwesomeIcon icon={faListUl} size="2x"/></span>
    </div>
       
    </div> 
    <div className="recipe-container">
        <img className="recipe-photo" src={recipe} alt="photo" />
    <div className="basic-information">
        <div className="recipe-name">生煎牛仔骨   {recipeStateItems.name}</div>
        <div className="user-data">
        <img src={icon} alt="Icon" className="icon" />
        <div>
            <i>username</i>
            <i>short info</i>
        </div>
        </div>
        <div className="recipe-summary"><div>加入乾蔥, 蒜茸等爆香, 再加洋蔥及青紅椒粒, 炒香; 再倒下牛仔骨兜勻, 加入茨汁拌勻, 上碟。</div></div>
        <div className="recipe-style"><div>分類: 中式 非素食</div></div>
        <div className="Serving-size">份量: 4人份</div>
        <div className="cooking-time">時間： 35分鐘</div>
    </div>

    <div className="ingredients-information">
        <div className="recipe-name">食材</div>
        <div className="ingredients-set">
            <div className="set-name">材料</div>
            <div className="ingredients-item"><div>美國牛仔骨 </div><div>1磅</div></div>
            <div className="ingredients-item"><div>洋蔥</div><div>1 隻</div></div>
            <div className="ingredients-item"><div>乾蔥 </div><div>2 粒 </div></div>
            <div className="ingredients-item"><div>蒜頭 </div><div>2 粒</div></div>
            <div className="ingredients-item"><div>青椒</div><div>半隻</div></div>
            <div className="ingredients-item"><div>黑胡椒碎</div><div> 適量</div></div>
        </div>
        <div className="ingredients-set">
            <div className="set-name">醃料</div>
            <div className="ingredients-item"><div>特鮮生抽 </div><div>1.5 湯匙</div></div>
            <div className="ingredients-item"><div>紹酒 </div><div>2 茶匙</div></div>
            <div className="ingredients-item"><div>特級蠔油 </div><div>2 茶匙</div></div>
            <div className="ingredients-item"><div>糖 </div><div>2 茶匙</div></div>
            {
                (recipeStateItems.recipeIngredients).map((recipeIngredient) => 
                <div className="ingredients-item">{recipeIngredient.ingredient_name}</div>)
            }
        </div>
    </div>

    <div className="step-information">
        <div className="recipe-name">烹調步驟</div>
      
          <div className="step-item">
           <div className="single-step">
            <div className="step-number" >1</div>
            <div className="ingredients-item">
              將牛仔骨加入醃料拌匀，醃 20 分鐘。
              </div> </div>
            <img className="recipe-photo" src={recipe} alt="photo" />
          </div>

          <div className="step-item">
              <div className="single-step">
            <div className="step-number" >2</div>
            <div className="ingredients-item">
              <div>乾蔥及蒜頭切茸及洋蔥, 紅椒及青椒切粒備用。</div>
              </div> </div>
              <img className="recipe-photo" src={recipe} alt="photo" />
          </div>

          <div className="step-item">
              <div className="single-step">
            <div className="step-number" >3</div>
            <div className="ingredients-item">
              <div>燒熱煎鍋, 加油將牛仔骨煎至 8 成熟, 盛起。</div>
              </div> </div>
              <img className="recipe-photo" src={recipe} alt="photo" />
          </div>

          <div className="step-item">
              <div className="single-step">
            <div className="step-number" >4</div>
            <div className="ingredients-item">
              <div>加入乾蔥, 蒜茸等爆香, 再加洋蔥及青紅椒粒, 炒香; 再倒下牛仔骨兜勻, 加入茨汁拌勻, 上碟。</div>
              </div>  </div>
              <div className="step-img"><img className="recipe-photo" src={recipe} alt="photo" /></div>
            </div>
        
        
        </div>

        <div className="cook-snap-information">
          <div className="recipe-name">Cooksnap</div>
          <div>分享你的成品照給大家吧</div>
          <button>上傳到Cooksnap</button>
        </div>

        <div className="comment-section">
          <div className="recipe-name">留言</div>
          <div><input type="text" placeholder="新增留意"></input></div>
        </div>



      
        </div>
    </div>
    
    

}