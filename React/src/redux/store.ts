import { configureStore } from "@reduxjs/toolkit";
import userReducer, { UserState } from "./user/userSlice"
import todoReducer, { TodoListState } from "./todo/todoSlice"
import recipeReducer, { RecipeState } from "./recipe/recipeSlice"
import postingReducer, { PostingState } from "./posting/postingSlice";
import profileRecipeReducer, { ProfileRecipeItemState, ProfileState } from "./profileRecipe/profileRecipeSlice";
export interface IRootState {
    user: UserState
    todo: TodoListState
    recipe: RecipeState
    posting: PostingState
    profile: ProfileState
}

const store = configureStore<IRootState>({
    reducer: {
        user: userReducer,
        todo: todoReducer,
        recipe: recipeReducer,
        posting: postingReducer,
        profile: profileRecipeReducer

    }
})

export default store