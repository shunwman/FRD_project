import { createAsyncThunk } from '@reduxjs/toolkit'
import { RecipeState } from './recipeSlice'

export const fetchGetRecipeItem: any = createAsyncThunk("recipe/item", async (params: { id: number }, thunkAPI) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_HOST}/recipe`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: params.id
            })
        })

        const data = await res.json()
        if (!res.ok) {
            throw new Error(data.msg)
        }
        //console.log(data)
        const recipeItem: any = data
        return thunkAPI.fulfillWithValue<{ data: any }>(recipeItem)
    } catch (e: any) {
        return thunkAPI.rejectWithValue({ error: e.message })
    }
})


export const fetchGetSearchItem: any = createAsyncThunk("recipe/search", async (
    params: {
        recipeKeyword: string,
        ingredients: string,
        methods: string[],
        category: string,
        style: string,
        time: string,
        isVegan: string
    }
    , thunkAPI) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_HOST}/recipe/search`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                recipeKeyword: params.recipeKeyword,
                ingredients: params.ingredients,
                methods: params.methods,
                category: params.category,
                style: params.style,
                time: params.time,
                isVegan: params.isVegan
            })
        })

        const data = await res.json()
        if (!res.ok) {
            throw new Error(data.msg)
        }
        console.log(data)
        const searchItem: any = data
        return thunkAPI.fulfillWithValue<{ data: any }>(searchItem)
    } catch (e: any) {
        return thunkAPI.rejectWithValue({ error: e.message })
    }
})

export const fetchSaveRecipe: any = createAsyncThunk("recipe/save", async (params: {
    userId: number,
    recipeId: string
}, thunkAPI) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_HOST}/recipe/save`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                userId: params.userId,
                recipeId: params.recipeId,
            })
        })
        const data = await res.json()
        console.log("saveReturn:", data)
        if (!res.ok) {
            throw data.msg
        }
        return thunkAPI.fulfillWithValue<{
            message: string
        }>({
            message: data.message
        })
    } catch (e) {
        console.log(e)
        return thunkAPI.rejectWithValue({ error: e })
    }
})

export const fetchUnsaveRecipe: any = createAsyncThunk("recipe/unsave", async (params: {
    userId: number,
    recipeId: number
}, thunkAPI) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_HOST}/recipe/unsave`, {
            method: "DELETE",
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`

            },
            body: JSON.stringify({
                userId: params.userId,
                recipeId: params.recipeId,
            })
        })
        const data = await res.json()
        if (!res.ok) {
            throw data.msg
        }
        return thunkAPI.fulfillWithValue<{
            message: string
        }>({
            message: data.message
        })
    } catch (e) {
        console.log(e)
        return thunkAPI.rejectWithValue({ error: e })
    }
})

export const fetchSaveCheck: any = createAsyncThunk("recipe/checksave", async (params: {
    userId: number,
    recipeId: number
}, thunkAPI) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_HOST}/recipe/checksave`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                userId: params.userId,
                recipeId: params.recipeId,
            })
        })
        const data = await res.json()
        if (!res.ok) {
            throw data.msg
        }
        return thunkAPI.fulfillWithValue<{
            message: string
        }>({
            message: data.message
        })
    } catch (e) {
        console.log(e)
        return thunkAPI.rejectWithValue({ error: e })
    }
})

export const fetchRecipeComment: any = createAsyncThunk("recipe/fetchRecipeComment", async (params: {
    recipeId: number,
}, thunkAPI) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_HOST}/recipe/comment`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                recipeId: params.recipeId
            })
        })
        const data = await res.json()
        if (!res.ok) {
            throw data.msg
        }
        return thunkAPI.fulfillWithValue<{
            comment: Array<object>
        }>({
            comment: data.comment
        })
    } catch (e) {
        console.log(e)
        return thunkAPI.rejectWithValue({ error: e })
    }
})

export const fetchLikeRecipe: any = createAsyncThunk("recipe/like", async (params: {
    userId: number,
    recipeId: string
}, thunkAPI) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_HOST}/recipe/like`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                userId: params.userId,
                recipeId: params.recipeId,
            })
        })
        const data = await res.json()
        console.log("saveReturn:", data)
        if (!res.ok) {
            throw data.msg
        }
        return thunkAPI.fulfillWithValue<{
            message: string
        }>({
            message: data.message
        })
    } catch (e) {
        console.log(e)
        return thunkAPI.rejectWithValue({ error: e })
    }
})

export const fetchUnLikeRecipe: any = createAsyncThunk("recipe/unlike", async (params: {
    userId: number,
    recipeId: number
}, thunkAPI) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_HOST}/recipe/unlike`, {
            method: "DELETE",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                userId: params.userId,
                recipeId: params.recipeId,
            })
        })
        const data = await res.json()
        if (!res.ok) {
            throw data.msg
        }
        return thunkAPI.fulfillWithValue<{
            message: string
        }>({
            message: data.message
        })
    } catch (e) {
        console.log(e)
        return thunkAPI.rejectWithValue({ error: e })
    }
})

export const fetchLikeCheck: any = createAsyncThunk("recipe/checklike", async (params: {
    userId: number,
    recipeId: number
}, thunkAPI) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_HOST}/recipe/checklike`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                userId: params.userId,
                recipeId: params.recipeId,
            })
        })
        const data = await res.json()
        if (!res.ok) {
            throw data.msg
        }
        return thunkAPI.fulfillWithValue<{
            message: string
        }>({
            message: data.message
        })
    } catch (e) {
        console.log(e)
        return thunkAPI.rejectWithValue({ error: e })
    }
})


