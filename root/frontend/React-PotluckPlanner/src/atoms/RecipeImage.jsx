// imports
import { useState } from "react";

export default function RecipeImage() {

    const [image, setImage] = useState(null);

    const handleImageSelect=(e)=>{
        console.log(e);
        const file = e.target.files[0];
        if (file) {
            setImage(file);
        }
    }

    const handleUpload=async()=>{

        if(!image){
            alert("Please select image first!")
        }

        const formData=new FormData();
        formData.append("image", image);
    }

    return(
        <div style={{ border: "2px dashed #d1d5db", backgroundColor: "#f9fafb", borderRadius: "8px", padding: "20px", textAlign: "center", cursor: "pointer", maxWidth: "100%" }}>
            <div style={{ fontSize: "20px", fontWeight: 600, }} >Image Upload & Preview</div>
            <input type='file' accept='image/*' onChange={handleImageSelect}/>
            {image && (
                <div style={{ height: "120px", width: "120px", overflow: "hidden",}}>
                    <img src={URL.createObjectURL(image)} style={{ height: "100%", width: "100%", objectFit: "contain"}}/>
                </div>
            )}
        </div>
    )
}