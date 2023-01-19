import { useState, useEffect } from "react";
import { IRootState } from "../redux/store";
import { useDispatch,useSelector } from "react-redux";
import {  RecipeCardState } from "../redux/recipe/recipeSlice"
import "@fortawesome/fontawesome-free/css/all.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLeftLong, faSave, faCamera, faListUl, faHeart } from '@fortawesome/free-solid-svg-icons'
import Button from 'react-bootstrap/Button';
import { useNavigate,useSearchParams } from 'react-router-dom';
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { Image } from '@chakra-ui/react'
import store from '../redux/store' 
import "../css/result.css"
const delay = 5;

export default function App() {
    const dispatch = useDispatch()
  const [show, setShow] = useState(false);
  const recipeData: any   = useSelector((state: IRootState) => state.recipe.recipeCardState)
  const data = JSON.parse(localStorage.getItem("oldSearchResult") || "[]");
  const [recipeCard, setCurrCard] = useState(data);
  
  let navigate = useNavigate();
  function leftBtn() {
    navigate("/search-page");
  }
  return <div className="container"> 
    <div className="navbar">
      <Button type="button" className="return-btn" onClick={leftBtn}><FontAwesomeIcon icon={faLeftLong} size="2x" /></Button>
      
      <div>

    </div>
        搜尋到 {recipeCard.length} 個相關的食譜
        
    </div> 
    <div className="recipe-container">
  
    {
      recipeCard &&
      recipeCard.map((recipeSingleCard: any, index: number) => 
        <ul key={index}>
        <div className="search-result-item">
        <Link to= {`/recipe-page/?id=${recipeSingleCard.id}`} className="search-result-link">
        
        <Image objectFit="cover" boxSize='80vw' src={ recipeSingleCard.images ?  recipeSingleCard.images[0]:''} alt='Dan Abramov' />
        <div>
        <div className="search-result-name-container"><span className="search-result-name">{recipeSingleCard.name} </span> <span className="search-result-name"><FontAwesomeIcon icon={faHeart} />{recipeSingleCard.count?recipeSingleCard.count:0}</span> </div>
        <div className="search-result-username-container"><span className="search-result-username"> {recipeSingleCard.username} </span> <span className="search-result-username">{recipeSingleCard.duration_min}分鐘</span></div>
        </div>
        </Link>
        </div>
        </ul>
      )
    }
     
        </div>
    </div>
    
}


//<Link to= {`/recipe-page/?id=${recipeCard && recipeCard[1].id}`} className="search-result-link">
//<div className="search-result-item">
//  <div className="search-result-item-wrapper">
//<img className="search-result-item-photo" src={`https://recipe-bucket-s3.s3.ap-southeast-1.amazonaws.com/${ recipeCard && recipeCard[1].images ?  recipeCard[1].images[2]:''}`} alt="photo" />
//</div>
//<div className="search-result-text-wrapper">
//<span className="search-result-name">{recipeCard[1].name}</span> <br/>
//<span className="search-result-username"> {recipeCard[1].username}</span> 
//</div>
//</div>
//</Link>

//
//<div className="search-result-item">
//<Link to= {`/recipe-page/?id=${recipeCard && recipeCard[4].id}`} className="search-result-link">
//<img className="recipe-photo" src={`https://recipe-bucket-s3.s3.ap-southeast-1.amazonaws.com/${ recipeCard && recipeCard[4].images ?  recipeCard[4].images[1]:''}`} alt="photo" />
//<div>
//<span className="search-result-name">{recipeCard[4].name} </span><br/>
//<span className="search-result-username"> {recipeCard[4].username} </span> 
//</div>
//</Link>
//</div>
//
