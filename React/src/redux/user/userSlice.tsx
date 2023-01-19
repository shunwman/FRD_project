import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchLogin } from "./thunk";
export interface UserState {
    isLoggedIn: boolean
    displayName: string
    errMsg: string
}

const userSlice = createSlice({
    name: "user",
    initialState: {
        isLoggedIn: false
    } as UserState,
    reducers: {
        test() {

        }
    },
    extraReducers: (build) => {
        build.addCase(fetchLogin.pending, (state: UserState) => {
            console.log("pending : " , state.isLoggedIn)
        })
        build.addCase(fetchLogin.fulfilled, (state, action: PayloadAction<{displayName: string}>) => {
            const displayName = action.payload.displayName
            state.displayName = displayName
            state.isLoggedIn = true
            console.log("fulfilled : " , state.isLoggedIn)

        })
        build.addCase(fetchLogin.rejected, (state, action: PayloadAction<{error: string}>) => {
            const error = action.payload.error
            state.errMsg = error
            console.log("rejected : " , state.isLoggedIn)

        })
    }
})

export default userSlice.reducer