import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import jwt_decode from "jwt-decode"

import { fetchLogin, fetchRegister, fetchGetMe, fetchSendCookSnap, fetchLogout, fetchEditPage } from "./thunk";
export interface UserState {
    isLoggedIn: boolean
    displayName: string
    errMsg: string
    displayEmail: string
    displayId: number
    userIcon: string
}

const userSlice: any = createSlice({
    name: "user",
    initialState: {
        isLoggedIn: false
    } as UserState,
    reducers: {
        test() {

        },
        updateUserICON() {

        }
    },
    extraReducers: (build) => {
        build.addCase(fetchLogin.pending, (state: UserState) => {
            console.log("pending : ", state.isLoggedIn)
        })
        build.addCase(fetchLogin.fulfilled, (state, action: PayloadAction<{ token: string }>) => {
            state.isLoggedIn = true
            const token = action.payload.token
            let payload = jwt_decode<{
                displayName: string,
                displayEmail: string,
                user_id: number,
                userIcon: string,
            }>(token)
            localStorage.setItem("token", token)
            state.displayName = payload.displayName
            state.displayEmail = payload.displayEmail
            state.displayId = payload.user_id
            state.userIcon = payload.userIcon
            console.log("fulfilled : ", state.isLoggedIn)

        })
        build.addCase(fetchLogin.rejected, (state, action: PayloadAction<{ error: string }>) => {
            const error = action.payload.error
            state.errMsg = error
            console.log("rejected : ", state.isLoggedIn)

        })
        build.addCase(fetchRegister.fulfilled, (state, action: PayloadAction<{ message: string }>) => {

            console.log(" Register fulfilled : ", action.payload.message)

        })
        build.addCase(fetchRegister.rejected, (state, action: PayloadAction<{ error: string }>) => {
            const error = action.payload.error
            state.errMsg = error
            console.log("Register rejected : ", error)

        })


        build.addCase(fetchGetMe.fulfilled, (state, action: PayloadAction<{ token: string }>) => {
            state.isLoggedIn = true

            const token = action.payload.token
            let payload = jwt_decode<{
                displayName: string,
                displayEmail: string,
                user_id: number,
                displayIcon: string,
            }>(token)
            state.displayName = payload.displayName
            state.displayEmail = payload.displayEmail
            state.displayId = payload.user_id
            state.userIcon = payload.displayIcon
            //console.log("userId : ", state.displayId)


        })
        build.addCase(fetchSendCookSnap.fulfilled, (state, action: PayloadAction<{ accessPath: string }>) => {
            console.log(action.payload)
            console.log("cooksnap accessPath: ", action.payload.accessPath)

        })
        build.addCase(fetchSendCookSnap.rejected, (state, action: PayloadAction<{ error: string }>) => {
            console.log(action.payload)
            const error = action.payload.error
            state.errMsg = error
            console.log("snap rejected : ")

        })
        build.addCase(fetchLogout.fulfilled, (state, action: PayloadAction<{ error: string }>) => {
            console.log(action.payload)
            state.displayName = ""
            state.displayEmail = ""
            state.displayId = 0
            state.userIcon = ""
            localStorage.removeItem("token")
        })
        build.addCase(fetchEditPage.fulfilled, (state, action: PayloadAction<{ error: string }>) => {
            console.log(action.payload)

        })
    }
})

export default userSlice.reducer