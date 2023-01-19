import { createAsyncThunk } from '@reduxjs/toolkit'
import { MyCollectionItemState, ProfileRecipeItemState } from './profileRecipeSlice'

export const fetchGeCollectionItems: any = createAsyncThunk("profileRecipe/collection/items", async (params: {
    userId: number

}, thunkAPI) => {
    try {
        console.log(params.userId)
        const res = await fetch(`${process.env.REACT_APP_API_HOST}/profileRecipe/collection/items`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                userId: params.userId,

            })
        })
        const data = await res.json()
        if (!res.ok) {
            throw new Error(data.msg)
        }
        console.log(data)

        return thunkAPI.fulfillWithValue<MyCollectionItemState[]>(data)
    } catch (e: any) {
        return thunkAPI.rejectWithValue({ error: e.message })
    }
})


export const fetchGetMyRecipeItems: any = createAsyncThunk("profileRecipe/my-recipe/items", async (params: {
    userId: number

}, thunkAPI) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_HOST}/profileRecipe/my-recipe/items`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                userId: params.userId,

            })
        })
        const data = await res.json()
        if (!res.ok) {
            throw new Error(data.msg)
        }
        console.log(data)
        const MyRecipeItems: any[] = data
        return thunkAPI.fulfillWithValue<ProfileRecipeItemState[]>(MyRecipeItems)
    } catch (e: any) {
        return thunkAPI.rejectWithValue({ error: e.message })
    }
})


