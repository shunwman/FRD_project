import { createAsyncThunk } from '@reduxjs/toolkit'
import { stringify } from 'querystring';
import { IngredientsPostItemState, NewRecipeIdState, PostedRecipesItemsState, PostingState, RecipeFormItemState } from './postingSlice';

export const fetchGetPostedRecipes: any = createAsyncThunk("posting/fetchGetPostedRecipes", async (params, thunkAPI) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_HOST}/posting/fetchGetPostedRecipes`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
        })

        //  from backend
        const data = await res.json()
        if (!res.ok) {
            throw data.msg
        }
        console.log("fetchGetPostedRecipes:", data)

        const postedRecipesItems: any[] = data

        // !! solve the returned values problem 

        return thunkAPI.fulfillWithValue<PostedRecipesItemsState[]>(postedRecipesItems)

    } catch (e) {
        console.log(e)
        return thunkAPI.rejectWithValue({ error: e })
    }
})

export const fetchPostNewBlankRecipe: any = createAsyncThunk("posting/fetchPostNewBlankRecipe", async (params, thunkAPI) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_HOST}/posting/fetchPostNewBlankRecipe`, {
            method: "Post",
            headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
        })

        //  from backend
        const data = await res.json()
        if (!res.ok) {
            throw data.msg
        }
        console.log("fetchPostNewBlankRecipe:", data)

        // const postedRecipesItems: any[] = data

        // !! solve the returned values problem 

        // return thunkAPI.fulfillWithValue({ success: true })
        // .fulfillWithValue<PostedRecipesItemsState[]>(postedRecipesItems)
        let newRecipeId: any = data[0].id
        console.log("newRecipeId:", newRecipeId)
        return thunkAPI.fulfillWithValue<NewRecipeIdState>(newRecipeId)

    } catch (e) {
        console.log(e)
        return thunkAPI
            .rejectWithValue({ error: e })
    }
})

export const fetchGetRecipeFormItems: any = createAsyncThunk("posting/fetchGetRecipeFormItems", async (params: {
    recipeId: number
}, thunkAPI) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_HOST}/posting/fetchGetRecipeFormItems`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`

            },
            body: JSON.stringify({
                recipeId: params.recipeId,
            })

        })

        const data = await res.json()
        if (!res.ok) {
            throw new Error(data.msg)
        }
        console.log(data)
        const recipeFormItems: any[] = data

        return thunkAPI.fulfillWithValue<RecipeFormItemState>(recipeFormItems[0])
    } catch (e: any) {
        return thunkAPI.rejectWithValue({ error: e.message })
    }
})

export const fetchPublishRecipeForm: any = createAsyncThunk("posting/fetchPublishRecipeForm", async (params: {
    recipeId: number,

}, thunkAPI) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_HOST}/posting/fetchPublishRecipeForm`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({

                recipeId: params.recipeId,

            })
        })
        //  from backend
        const data = await res.json()
        if (!res.ok) {
            throw new Error(data.msg)
        }
        console.log("updated data in dB:", data)

        const ingredientsPostItems: any[] = data
        return thunkAPI.fulfillWithValue<IngredientsPostItemState[]>(ingredientsPostItems)

    } catch (e) {
        console.log(e)
        return thunkAPI.rejectWithValue({ error: e })
    }

})

export const fetchPosting: any = createAsyncThunk("posting/fetchPosting", async (params: {
    // imageNames: string[];
    recipeName: string;
    // recipeIntro: string;
    // isVegan: boolean;
    // servingSize: any;
    // durationMin: any;
    // ingredients: string[];
}, thunkAPI) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_HOST}/posting/posting`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({

                // imageNames: params.imageNames,
                recipeName: params.recipeName,
                // recipeIntro: params.recipeIntro,
                // isVegan: params.isVegan,
                // servingSize: params.servingSize,
                // durationMin: params.durationMin,
                // ingredients: params.ingredients
            })
        })

        //  from backend
        const data = await res.json()
        if (!res.ok) {
            throw data.msg
        }

        console.log("thunk data:", data)

        return thunkAPI.fulfillWithValue<{
            //  from backend
            message: string
        }>({
            //  from backend
            message: data.message
        })
    } catch (e) {
        console.log(e)
        return thunkAPI.rejectWithValue({ error: e })
    }
})

export const fetchPostRecipeImage: any = createAsyncThunk("posting/postRecipeImage", async (params: {

    recipeId: number
    fileSent: any

}, thunkAPI) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_HOST}/posting/postRecipeImage`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                recipeId: params.recipeId,
                fileSent: params.fileSent

            })
        })

        //  from backend
        const data = await res.json()
        if (!res.ok) {
            throw data.msg
        }

        console.log("thunk data:", data)

        return thunkAPI.fulfillWithValue<{
            //  from backend
            message: string
        }>({
            //  from backend
            message: data.message
        })
    } catch (e) {
        console.log(e)
        return thunkAPI.rejectWithValue({ error: e })
    }
})

export const fetchPostRecipeImageAws: any = createAsyncThunk("posting/postRecipeImageAws", async (params: {

    recipeId: number,
    fileSent: any

}, thunkAPI) => {
    try {
        let formData = new FormData()
        console.log('!!', params)
        formData.append('test', params.fileSent)
        formData.append('recipeId', (params.recipeId).toString())
        console.log(formData)
        const res = await fetch(`${process.env.REACT_APP_API_HOST}/file`, {
            method: "POST",
            body: formData
        })

        //  from backend
        const data = await res.json()
        if (!res.ok) {
            throw data.msg
        }

        console.log("thunk data:", data)

        return thunkAPI.fulfillWithValue<{
            //  from backend
            message: string
        }>({
            //  from backend
            message: data.message
        })
    } catch (e) {
        console.log(e)
        return thunkAPI.rejectWithValue({ error: e })
    }
})

export const fetchUploadCoverImage: any = createAsyncThunk("posting/uploadCoverImage", async (params: {

    recipeId: number,
    fileSent: any

}, thunkAPI) => {
    try {
        let formData = new FormData()
        // console.log('!!', params)
        formData.append('test', params.fileSent)
        formData.append('recipeId', (params.recipeId).toString())
        console.log(formData)
        const res = await fetch(`${process.env.REACT_APP_API_HOST}/posting/uploadCoverImage`, {
            method: "POST",
            body: formData
        })

        //  from backend
        const data = await res.json()
        if (!res.ok) {
            throw new Error(data.msg)
        }
        console.log(data)
        const recipeFormItems: any[] = data

        return thunkAPI.fulfillWithValue<RecipeFormItemState>(recipeFormItems[0])
    } catch (e: any) {
        return thunkAPI.rejectWithValue({ error: e.message })
    }
})

export const fetchUpdateAllDataExceptIngredientsAndCover: any = createAsyncThunk("posting/updateAllDataExceptIngredientsAndCover", async (params: {
    recipeId: number
    recipeName: string,
    recipeFormDescriptions: string,
    recipeFormCuisineType: number,
    recipeFormIsVegan: boolean,
    recipeFormServingSize: number,
    recipeFormDurationMin: number,
    recipeSteps: any
}, thunkAPI) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_HOST}/posting/updateAllDataExceptIngredientsAndCover`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                recipeId: params.recipeId,
                recipeName: params.recipeName,
                recipeFormDescriptions: params.recipeFormDescriptions,
                recipeFormCuisineType: params.recipeFormCuisineType,
                recipeFormIsVegan: params.recipeFormIsVegan,
                recipeFormServingSize: params.recipeFormServingSize,
                recipeFormDurationMin: params.recipeFormDurationMin,
                recipeSteps: params.recipeSteps
            })

        })

        const data = await res.json()
        if (!res.ok) {
            throw new Error(data.msg)
        }
        console.log("thunk", data)
        const recipeFormItems: any[] = data

        return thunkAPI.fulfillWithValue<RecipeFormItemState>(recipeFormItems[0])

    } catch (e: any) {
        return thunkAPI.rejectWithValue({ error: e.message })
    }
})

export const fetchGetIngredientsPostItems: any = createAsyncThunk("posting/getIngredientsPostItems", async (params: {
    recipeId: number
}, thunkAPI) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_HOST}/posting/getIngredientsPostItems`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                recipeId: params.recipeId,
            })

        })

        const data = await res.json()
        if (!res.ok) {
            throw new Error(data.msg)
        }
        console.log(data)
        const ingredientsPostItems: any[] = data
        return thunkAPI.fulfillWithValue<IngredientsPostItemState[]>(ingredientsPostItems)
    } catch (e: any) {
        return thunkAPI.rejectWithValue({ error: e.message })
    }
})

export const fetchUpdateIngredientsPostItem: any = createAsyncThunk("posting/putIngredientsPostItem", async (params: {
    recipeId: number,
    id: number,
    ingredient_name: string,
    quantity: string
}, thunkAPI) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_HOST}/posting/putIngredientsPostItems`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({

                recipeId: params.recipeId,
                id: params.id,
                ingredient_name: params.ingredient_name,
                quantity: params.quantity

            })
        })
        //  from backend
        const data = await res.json()
        if (!res.ok) {
            throw new Error(data.msg)
        }
        console.log("updated data in dB:", data)

        const ingredientsPostItems: any[] = data
        return thunkAPI.fulfillWithValue<IngredientsPostItemState[]>(ingredientsPostItems)

    } catch (e) {
        console.log(e)
        return thunkAPI.rejectWithValue({ error: e })
    }

})

export const fetchAddBlankIngredientsPostItems: any = createAsyncThunk("posting/addBlankIngredientsPostItem", async (params: {
    recipeId: number
}, thunkAPI) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_HOST}/posting/addBlankIngredientsPostItem`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                recipeId: params.recipeId,
            })

        })

        const data = await res.json()
        if (!res.ok) {
            throw new Error(data.msg)
        }
        console.log(data)
        const ingredientsPostItems: any[] = data
        return thunkAPI.fulfillWithValue<IngredientsPostItemState[]>(ingredientsPostItems)
    } catch (e: any) {
        return thunkAPI.rejectWithValue({ error: e.message })
    }
})

export const fetchDeleteIngredientsItem: any = createAsyncThunk("posting/deleteIngredientsPostItem", async (params: {
    recipeId: number
    id: number
}, thunkAPI) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_HOST}/posting/deleteIngredientsPostItems`, {
            method: "Delete",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                recipeId: params.recipeId,
                id: params.id,
            })
        })
        const data = await res.json()
        if (!res.ok) {
            throw new Error(data.msg)
        }
        const ingredientsPostItems: any[] = data
        return thunkAPI.fulfillWithValue<IngredientsPostItemState[]>(ingredientsPostItems)
    } catch (e: any) {
        return thunkAPI.rejectWithValue({ error: e.message })
    }
})


