import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchGeCollectionItems, fetchGetMyRecipeItems } from "./thunk";



export enum ProfileRecipeItemStatus {
    Collection = "collection",
    MyRecipe = "myRecipe"
}

export interface ProfileRecipeItemState {
    user_id: number;
    recipes_id: number;
    name: string;
    status: ProfileRecipeItemStatus;
    ProfileState: ProfileState
}

export interface MyCollectionItemState {
    id: number;
    recipe_id: number;
    user_id: number;
    created_at: number;
    updated_at: number;
    name: string;
    cuisine_type_id: number;
    serving_size: number;
    duration_min: number;
    isVegan: boolean
    descriptions: string[];
    step: string;
    cover_image: string;
    status: ProfileRecipeItemStatus
    username: string;
    email: string;
    password: string;
    introduction: string;
    user_icon: string;
}

export interface MyRecipeItemState {
    id: number;
    user_id: number;
    name: string
    cuisine_type_id: number;
    serving_size: number;
    duration_min: number;
    isVegan: boolean;
    descriptions: string;
    steps: string;
    status: string;
    cover_image:string
    created_at: number;
    updated_at: number;
}



export interface ProfileState {
    searchMode: ProfileRecipeItemStatus
    myRecipeItems: MyRecipeItemState[]
    collectionItems: MyCollectionItemState[]
}
const profileRecipeSlice = createSlice({
    name: "profile-recipes",
    initialState: {
        searchMode: ProfileRecipeItemStatus.MyRecipe,
        myRecipeItems: [],
        collectionItems: []
    } as ProfileState,
    reducers: {

    },
    extraReducers: (builder) => {

        builder.addCase(fetchGeCollectionItems.fulfilled, (state, action) => {
            const items = action.payload
            state.collectionItems = items
            state.searchMode = ProfileRecipeItemStatus.Collection
            console.log("fulfilled")
        })
        builder.addCase(fetchGetMyRecipeItems.fulfilled, (state, action) => {
            const items = action.payload
            state.myRecipeItems = items
            state.searchMode = ProfileRecipeItemStatus.MyRecipe
            console.log("fulfilled")
        })

        // builder.addCase(fetchGeCollectionItems.fulfilled, getItem)
        // builder.addCase(fetchGeCollectionItems.rejected, (state, action) => {
        //     console.log("rejected")
        // })
    }

})



// const getItem = (state: ProfileRecipeItemState, action: PayloadAction<{ profileData: any }>) => {
//     const data = action.payload.profileData;
//     state.ProfileRecipeListState = data;
//     return state
// }

export default profileRecipeSlice.reducer