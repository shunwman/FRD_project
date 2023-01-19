import { createAsyncThunk } from '@reduxjs/toolkit'
import { log } from 'console'
import logger from 'redux-logger'

export const fetchLogin: any = createAsyncThunk("user/fetchLogin", async (params: {
    username: string
    password: string
}, thunkAPI) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_HOST}/user/login`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                username: params.username,
                password: params.password
            })
        })
        const data = await res.json()
        if (!res.ok) {
            throw data.msg
        }
        return thunkAPI.fulfillWithValue<{
            token: string
        }>({
            token: data.token
        })
    } catch (e) {
        console.log(e)
        return thunkAPI.rejectWithValue({ error: e })
    }
})








export const fetchRegister: any = createAsyncThunk("user/fetchRegister", async (params: {

    username: string
    password: string
    email: string
    user_icon: any
}, thunkAPI) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_HOST}/user/register`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                username: params.username,
                password: params.password,
                email: params.email,
                user_icon: params.user_icon,
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




export const fetchGetSavedPosts: any = createAsyncThunk("user/fetchGetSavedPosts", async (params: {
    user_id: number,
    recipeId: number,
}, thunkAPI) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_HOST}/user/getSavedPosts`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                user_id: params.user_id,
                recipeId: params.recipeId
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

export const fetchGetMe: any = createAsyncThunk("user/fetchGetMe", async (params: {
    token: string
}, thunkAPI) => {
    const res = await fetch(`${process.env.REACT_APP_API_HOST}/user/getme`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
            token: params.token
        })
    })
    const data = await res.json()
   
    return thunkAPI.fulfillWithValue<{
        token: string
    }>({
        token: data.token
    })
})

export const fetchSendComment: any = createAsyncThunk("user/fetchTextComment", async (params: {
    userId: number,
    recipeId: number,
    content: string,
    contentType: string,
    imageName: string
}, thunkAPI) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_HOST}/user/comment`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                userId: params.userId,
                recipeId: params.recipeId,
                content: params.content,
                contentType: params.contentType,
                imageName: params.imageName
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

export const fetchIconEdit: any = createAsyncThunk("user/fetchIconEdit", async (params: {

    userId: number,
    icon: File
}, thunkAPI) => {
    try {
        let formData = new FormData()
        console.log('!!', params)
        formData.append('userId', (params.userId).toString())
        formData.append('icon', params.icon)
        console.log(formData)
        const res = await fetch(`${process.env.REACT_APP_API_HOST}/user/edit/icon`, {
            method: "POST",
            body: formData
        })
        const data = await res.json()
        if (!res.ok) {
            throw data.msg
        }

        console.log("thunk data:", data)
        return thunkAPI.fulfillWithValue<{
            message: string
        }>({
            message: data.accessPath
        })
    } catch (e) {
        console.log(e)
        return thunkAPI.rejectWithValue({ error: e })
    }
})

export const fetchSendCookSnap: any = createAsyncThunk("user/fetchCookSnapComment", async (params: {
    userId: number,
    recipeId: number,
    content: string,
    contentType: string,
    image: File
}, thunkAPI) => {
    try {
        let formData = new FormData()
        console.log('!!', params)
        formData.append('userId', (params.userId).toString())
        formData.append('recipeId', (params.recipeId).toString())
        formData.append('content', params.content)
        formData.append('contentType', params.contentType)
        formData.append('image', params.image)
        console.log(formData)
        const res = await fetch(`${process.env.REACT_APP_API_HOST}/user/cooksnap/send`, {
            method: "POST",
            body: formData
        })
        const data = await res.json()
        if (!res.ok) {
            throw data.msg
        }

        console.log("thunk data:", data)
        return thunkAPI.fulfillWithValue<{
            message: string
        }>({
            message: data.accessPath
        })
    } catch (e) {
        console.log(e)
        return thunkAPI.rejectWithValue({ error: e })
    }
})

export const fetchLogout: any = createAsyncThunk("user/fetchLoginOut", async (params, thunkAPI) => {
    console.log("logout")
    return thunkAPI.fulfillWithValue<{
        message: string
    }>({
        message: "logout"
    })
})

export const fetchEditPage: any = createAsyncThunk("user/fetchEditPage", async (params: {
    userId: number
    username: string
    introduction: string
    email: string
    icon: File
}, thunkAPI) => {
    try { let typeOfIcon = typeof(params.icon)
            console.log(typeOfIcon)
        let data :any 
        if (typeOfIcon === "string" || params.icon === null){
            const res = await fetch(`${process.env.REACT_APP_API_HOST}/user/profile/edit/string`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    userId: params.userId,
                    username: params.username,
                    introduction: params.introduction,
                    email: params.email,
                    icon: params.icon
                })
            })
            data = res
        }else{
        let formData = new FormData()
        console.log('!!', params)
        formData.append('userId', (params.userId).toString())
        formData.append('username', params.username)
        formData.append('introduction', params.introduction)
        formData.append('email', params.email)
        formData.append('icon', params.icon)
        const res = await fetch(`${process.env.REACT_APP_API_HOST}/user/profile/edit/object`, {
            method: "POST",
            body: formData
            })
            data = res
        }
        
        if (!data.ok) {
            throw data.msg
        }
        data = await data.json()
        return thunkAPI.fulfillWithValue<{
            token: string
        }>({
            token: data.token
        })
    } catch (e) {
        console.log(e)
        return thunkAPI.rejectWithValue({ error: e })
    }


})
