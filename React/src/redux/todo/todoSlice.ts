import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { fetchAddTodoItem, fetchDeleteTodoItem, fetchGetTodoItems, fetchUpdateTodoItem } from "./thunk"

export enum TodoItemStatus {
    All = "",
    Active = "active",
    Complete = "complete"
}
export interface TodoItemState {
    id: number
    name: string
    status: TodoItemStatus
}
export interface TodoListState {
    searchMode: TodoItemStatus
    items: TodoItemState[]
}

const todoSlice = createSlice({
    name: "todos",
    initialState: {
        searchMode: TodoItemStatus.All,
        items: []
    } as TodoListState,
    reducers: {
        changeSearchMode(state: TodoListState, action: PayloadAction<TodoItemStatus>) {
            // const newItems = filterItems(state.items, action.payload)
            state.searchMode = action.payload
            // state.items = newItems
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchGetTodoItems.pending, (state, action) => {
            console.log("pending")
        })
        builder.addCase(fetchGetTodoItems.fulfilled, updateItems)
        builder.addCase(fetchGetTodoItems.rejected, (state, action) => {
            console.log("rejected")
        })

        builder.addCase(fetchAddTodoItem.fulfilled, updateItems)
        builder.addCase(fetchUpdateTodoItem.fulfilled, updateItems)
        builder.addCase(fetchDeleteTodoItem.fulfilled, updateItems)

    }
})
// const filterItems = (todoItems: TodoItemState[], currentSearchMode: TodoItemStatus) => {
//     const newItems = todoItems.filter((item) => {
//         return item.status == currentSearchMode
//     })
//     return newItems
// }

const updateItems = (state: TodoListState, action: PayloadAction<TodoItemState[]>) => {
    const currentSearchMode = state.searchMode
    if (currentSearchMode === TodoItemStatus.All) {
        state.items = action.payload
        return state
    }

    // const newItems = filterItems(action.payload, currentSearchMode)
    state.items = action.payload
    console.log("fulfilled", state)
    return state
}

export const { changeSearchMode } = todoSlice.actions
export default todoSlice.reducer