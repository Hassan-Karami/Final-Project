$(document).ready( function() {
    const form = $("form");
    const titleField = $("#title");
    const contentField = $("#content");
    const selectedThumbnail = document.getElementById("thumbnail");
    const selectedImages = document.getElementById("images");

    form.on("submit",async (e)=>{
        e.preventDefault();
        formData = new FormData();
        formData.append("title", titleField.val());
        formData.append("content", contentField.val());
        formData.append("thumbnail", selectedThumbnail.files[0]);
        for (let i = 0; i < selectedImages.files.length; i++) {
        formData.append('images', selectedImages.files[i]);
        }
        
        
        //send form-data with fetch
        const responseObject = await fetch("http://localhost:9000/api/articles",{
            method: "POST",
            body : formData
        });
        const response = await responseObject.json();
        if(responseObject.status>=400 && responseObject.status<600){
           return showMessage(response.message,"error");
        }
        console.log(response.data);
        showMessage(response.status,"success");


        
    })

})