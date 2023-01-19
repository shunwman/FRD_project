import { createAsyncThunk } from '@reduxjs/toolkit'







export const fetchUserIcon: any = createAsyncThunk("user/fetchUserIcon", async (params: {
    user_id: string,
    userIcon: any,
}, thunkAPI) => {
    try {
        let formData = new FormData();
        formData.append('user_id', (params.user_id))
        formData.append('icon', params.userIcon)
        console.log(formData);
        const res = await fetch(`${process.env.REACT_APP_API_HOST}/user/getme`, {
            method: "POST",
            body: formData,
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
            }
        })
        //backend
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
        return thunkAPI.fulfillWithValue({ error: e })
    }
})


