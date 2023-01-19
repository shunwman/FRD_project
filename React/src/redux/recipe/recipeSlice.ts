import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { fetchGetRecipeItem,fetchGetSearchItem,fetchRecipeComment } from "./thunk"

export interface RecipeIngredient {
    quantity : string
    ingredient_name: string
}

export interface RecipeCreator {
    username : string
    introduction: string
    user_icon : string 
}

export interface RecipeState {
    user: RecipeCreator
    name : string
    cuisine_type : string
    serving_size : number
    duration_min : number
    isVegan : boolean
    description: string
    steps : any
    image_names : any
    cooking_methods : string []
    recipeIngredients : RecipeIngredient []
    recipeCardState : RecipeCardState
    recipeTextComments: object []
    recipeCookSnaps: any []
    numOfLike: any []
}

export interface RecipeCardInformation {
    recipeId: number
    recipeName : string
    recipeImages : string []
    username: string 
    
}
export interface RecipeCardState{
    recipeCards : RecipeCardInformation []
}


const recipeSlice = createSlice({
    name: "recipe",
    initialState: {

    } as RecipeState,
    reducers: {
       // changeSearchMode(state: TodoListState, action: PayloadAction<TodoItemStatus>) {
        //    // const newItems = filterItems(state.items, action.payload)
         //   state.searchMode = action.payload
            // state.items = newItems
        //}
        test() {

        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchRecipeComment.pending, (state, action) => {
            console.log("pending")
        })
        builder.addCase(fetchRecipeComment.fulfilled, getComment)
        builder.addCase(fetchRecipeComment.rejected, (state, action) => {
            console.log("rejected")
        })
        builder.addCase(fetchGetRecipeItem.pending, (state, action) => {
            console.log("pending")
        })
        builder.addCase(fetchGetRecipeItem.fulfilled, getItem)
        builder.addCase(fetchGetRecipeItem.rejected, (state, action) => {
            console.log("rejected")
        })
        builder.addCase(fetchGetSearchItem.pending, (state, action) => {
            console.log("pending")
        })
        builder.addCase(fetchGetSearchItem.fulfilled, getResult)
        builder.addCase(fetchGetSearchItem.rejected, (state, action) => {
            console.log("rejected")
        })

    }
})
// const filterItems = (todoItems: TodoItemState[], currentSearchMode: TodoItemStatus) => {
//     const newItems = todoItems.filter((item) => {
//         return item.status == currentSearchMode
//     })
//     return newItems
// }
const getComment = (state: RecipeState, action: PayloadAction<{comment : any}>) => {

  const data = action.payload.comment
  console.log(data)
  const textComments = data.filter((item: any)=> {
    return item.content_type == "textComment"
  })
  const cookSnaps = data.filter((item: any)=> {
    return item.content_type == "cooksnap"
  })
  console.log(textComments)
  state.recipeTextComments = textComments
  console.log(cookSnaps)
  state.recipeCookSnaps = cookSnaps
  
  return state
//   const currentSearchMode =tate.searchMode
//   if (currentSearchMode === TodoItemStatus.All) {
//       state.items = action.payload
//       return state
//   }
//
//   // const newItems = filterItems(action.payload, currentSearchMode)
//   state.items = action.payloadResult
//   console.log(action.payload)
//   return state
}

const getItem = (state: RecipeState, action: PayloadAction<{recipeData : any}>) => {
    
    const data = action.payload.recipeData    ;
    state = data
    console.log(state)
    return state
//   const currentSearchMode = state.searchMode
//   if (currentSearchMode === TodoItemStatus.All) {
//       state.items = action.payload
//       return state
//   }
//
//   // const newItems = filterItems(action.payload, currentSearchMode)
//   state.items = action.payloadResult
//   console.log(action.payload)
//   return state
}

const getResult = (state: RecipeState, action: PayloadAction<{recipeData : any}>) => {
    const data = action.payload.recipeData;
    state.recipeCardState = data;
    localStorage.setItem("oldSearchResult", JSON.stringify(data))
    //const local = JSON.parse(localStorage.getItem("oldSearchResult") || "[]");
    //console.log(local)
    console.log(data)
    return state
}

export default recipeSlice.reducer