import { createAsyncThunk } from '@reduxjs/toolkit'
import { TodoItemState, TodoItemStatus } from './todoSlice'

export const fetchGetTodoItems: any = createAsyncThunk("todo/items", async (params, thunkAPI) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_HOST}/todoItems`)
        const data = await res.json()
        if (!res.ok) {
            throw new Error(data.msg)
        }
        console.log(data)
        const todoItems: any[] = data
        return thunkAPI.fulfillWithValue<TodoItemState[]>(todoItems)
    } catch (e: any) {
        return thunkAPI.rejectWithValue({ error: e.message })
    }
})

export const fetchAddTodoItem: any = createAsyncThunk("todo/addItem", async (params: { name: string }, thunkAPI) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_HOST}/todoItem`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: params.name
            })
        })
        const data = await res.json()
        if (!res.ok) {
            throw new Error(data.msg)
        }
        const todoItems: any[] = data
        return thunkAPI.fulfillWithValue<TodoItemState[]>(todoItems)
    } catch (e: any) {
        return thunkAPI.rejectWithValue({ error: e.message })
    }
})

export const fetchUpdateTodoItem: any = createAsyncThunk("todo/updateItem", async (params: {
    id: number
    name: string,
    status: TodoItemStatus
}, thunkAPI) => {
    console.log(params.status)
    try {
        const res = await fetch(`${process.env.REACT_APP_API_HOST}/todoItem`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: params.id,
                name: params.name,
                status: params.status
            })
        })
        const data = await res.json()
        if (!res.ok) {
            throw new Error(data.msg)
        }
        const todoItems: any[] = data
        return thunkAPI.fulfillWithValue<TodoItemState[]>(todoItems)
    } catch (e: any) {
        return thunkAPI.rejectWithValue({ error: e.message })
    }
})

export const fetchDeleteTodoItem: any = createAsyncThunk("todo/DeleteItem", async (params: {
    id: number
}, thunkAPI) => {
    try {
        const res = await fetch(`${process.env.REACT_APP_API_HOST}/todoItem`, {
            method: "Delete",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: params.id,
            })
        })
        const data = await res.json()
        if (!res.ok) {
            throw new Error(data.msg)
        }
        const todoItems: any[] = data
        return thunkAPI.fulfillWithValue<TodoItemState[]>(todoItems)
    } catch (e: any) {
        return thunkAPI.rejectWithValue({ error: e.message })
    }
})





