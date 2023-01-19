import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { fetchPostRecipeImage, fetchPostRecipeImageAws } from "../redux/posting/thunk";
import store from "../redux/store";

const useAppDispatch = () => useDispatch<typeof store.dispatch>()

export default function TestFileUpload() {


    const dispatch = useAppDispatch()
    const [file, setFile] = useState(Object);
    
    function handleChange(e: any) {
        console.log(e.target.files);
        let newUrl = URL.createObjectURL(e.target.files[0])
        console.log(newUrl)
        setFile(newUrl);
        // vv add send file logic
        // dispatch(fetchPostRecipeImage({
        //     recipeId: 5,
        //     fileSent: e.target.value
        // }))

        // fetchPostRecipeImage({
        //     recipeId: 5,
        //     fileSent: e.target.files
        // })

       dispatch(fetchPostRecipeImageAws({
            fileSent: file
        }))
        dispatch(fetchPostRecipeImageAws({
            recipeId: 5,
            fileSent: e.target.files[0]
        }))
    }

    let s3File = "https://c22-frd011b.s3.ap-southeast-1.amazonaws.com/1f245b2367756869e9b5b8700.gif"
    return (
        <div className="App">
            <h2>Add Image:</h2>
            <input type="file" onChange={handleChange} />
            <img src={file} />
            <img src={s3File} />
        </div>
    );
}

