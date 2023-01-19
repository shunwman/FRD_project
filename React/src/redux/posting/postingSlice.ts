import { createSlice, isPlainObject, PayloadAction } from "@reduxjs/toolkit"
import { fetchGetIngredientsPostItems, fetchGetPostedRecipes, fetchGetRecipeFormItems, fetchPosting, fetchPostNewBlankRecipe } from "./thunk"


export interface PostedRecipesItemsState {
    // recipeId: number
    // userId: number
    // recipeName: string
    // imageName: string
    created_at: any
    cuisine_type_id: any
    descriptions: any
    duration_min: any
    id: any
    isVegan: any
    name: any
    serving_size: any
    status: any
    steps: any
    updated_at: any
    user_id: any
    cover_image: any

}

export interface RecipeFormItemState {
    id: any
    user_id: any
    name: any
    descriptions: any
    cuisine_type_id: any
    isVegan: any
    serving_size: any
    duration_min: any
    steps: any
    status: any

}

export interface NewRecipeIdState {
    recipeId: number
}

export interface IngredientsPostItemState {
    recipeId: number
    id: number
    ingredient_name: string
    quantity: string
}

export interface PostingState {
    // recipeId: number (param?)
    // user_id: number <- may get by backend(token)
    // name : string
    // recipeName: string;
    postedRecipes: PostedRecipesItemsState[]
    ingredients: IngredientsPostItemState[]
    recipeFormItems: RecipeFormItemState
    newRecipeId: NewRecipeIdState
    // cuisine_type : string
    // serving_size : number
    // duration_min : number
    // isVegan : boolean
    // description: string
    // steps : any
    // image_names : string []
    // cooking_methods : string []
    // recipeIngredients : RecipeIngredient []
    // errMsg: string
}

const postingSlice = createSlice({
    name: "posting",
    initialState: {
        postedRecipes: [],
        ingredients: [],
        recipeFormItems: {
            id: "",
            user_id: "",
            name: "",
            descriptions: "",
            cuisine_type_id: "",
            isVegan: "",
            serving_size: "",
            duration_min: "",
            steps: "",
            status: ""
        },
        newRecipeId: 0,
    } as any as PostingState,

    reducers: {
        // resetRecipeFormItemsState(state: PostingState ) {
        //     state.recipeFormItems = {
        //             id: "",
        //             user_id: "",
        //             name: "",
        //             descriptions: "",
        //             cuisine_type_id: "",
        //             isVegan: "",
        //             serving_size: "",
        //             duration_min: "",
        //             steps: "",
        //             status: ""
        //         }
        //     }


        resetRecipeFormItemsState(state: PostingState) {
            state.recipeFormItems = {
                id: "",
                user_id: "",
                name: "",
                descriptions: "",
                cuisine_type_id: "",
                isVegan: "",
                serving_size: "",
                duration_min: "",
                steps: "",
                status: ""
            }

            state.ingredients = [

            ]
            return state
        },

        resetNewRecipeIdState(state: PostingState) {


            state.newRecipeId.recipeId = 0

            return state
        }

    },
    extraReducers: (builder) => {
        //     builder.addCase(fetchPosting.pending, (state, action) => {
        //         console.log("pending,","state.recipeName:", state.recipeName)
        //     })
        //     builder.addCase(fetchPosting.fulfilled, postRecipe)
        //     builder.addCase(fetchPosting.rejected, (state, action) => {
        //         console.log("rejected,", "state.recipeName:", state.recipeName)
        //     })

        builder.addCase(fetchGetPostedRecipes.pending, (state, action) => {
            console.log("pending")
        })
        builder.addCase(fetchGetPostedRecipes.fulfilled, updatePostedRecipesItems)
        builder.addCase(fetchGetPostedRecipes.rejected, (state, action) => {
            console.log("rejected")
        })


        builder.addCase(fetchGetRecipeFormItems.pending, (state, action) => {
            console.log("pending")
        })
        builder.addCase(fetchGetRecipeFormItems.fulfilled, loadRecipeItems)
        builder.addCase(fetchGetRecipeFormItems.rejected, (state, action) => {
            console.log("rejected")
        })



        builder.addCase(fetchGetIngredientsPostItems.pending, (state, action) => {
            console.log("pending")
        })
        builder.addCase(fetchGetIngredientsPostItems.fulfilled, updateIngredientsPostItems)
        builder.addCase(fetchGetIngredientsPostItems.rejected, (state, action) => {
            console.log("rejected")
        })

        builder.addCase(fetchPostNewBlankRecipe.pending, (state, action) => {
            console.log("pending")
        })
        builder.addCase(fetchPostNewBlankRecipe.fulfilled, updatePostId)
        builder.addCase(fetchPostNewBlankRecipe.rejected, (state, action) => {
            console.log("rejected")
        })

    }
})

const updatePostId = (state: PostingState, action: PayloadAction<NewRecipeIdState>) => {
    state.newRecipeId = action.payload
    console.log("updatePostId fulfilled:", state.newRecipeId)
    return state
}

const updatePostedRecipesItems = (state: PostingState, action: PayloadAction<PostedRecipesItemsState[]>) => {

    state.postedRecipes = action.payload
    console.log("updatePostedRecipesItems fulfilled", state.postedRecipes)
    return state

}

const loadRecipeItems = (state: PostingState, action: PayloadAction<RecipeFormItemState>) => {

    state.recipeFormItems = action.payload
    console.log("loadRecipeItems fulfilled", state.recipeFormItems)
    return state

}

const updateIngredientsPostItems = (state: PostingState, action: PayloadAction<IngredientsPostItemState[]>) => {

    // const newItems = filterItems(action.payload, currentSearchMode)
    state.ingredients = action.payload
    console.log("updateIngredientsPostItems fulfilled", state.ingredients)
    return state
}


const postRecipe = (state: PostingState, action: PayloadAction<{ postingData: any }>) => {
    console.log(action.payload)

}

export const { resetNewRecipeIdState } = postingSlice.actions
export const { resetRecipeFormItemsState } = postingSlice.actions
export default postingSlice.reducer