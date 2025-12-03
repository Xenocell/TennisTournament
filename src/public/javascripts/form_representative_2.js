$(document).ready(function() {   
    function getParameterByName(name) {
        var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
        return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    }

    const dropArea = document.querySelector(".drag-area"),
    dragText = dropArea.querySelector("header"),
    button = dropArea.querySelector("button"),
    input = dropArea.querySelector("input");

    const dropArea2 = document.querySelector(".photo2"),
    dragText2 = dropArea2.querySelector("header"),
    button2 = dropArea2.querySelector("button"),
    input2 = dropArea2.querySelector("input");

    let file; //this is a global variable and we'll use it inside multiple functions
    let file2;
    //----- 
    $('#back').click( function e() {
        document.location.href='/form/1'
    })
    const modal = (text) =>{
        $('.modal-body').html('');
        $('.modal-body').html(text);
        $('#exampleModal').modal('show');
    }
    $('#send').click( async function e() {
        if( !($('.drag-area').hasClass('active')) ){
            return modal('Вы не загрузили фотографию игрока!')
        }
        if( !($('.photo2').hasClass('active')) ){
            return modal('Вы не загрузили фотографию представителя!')
        }
        if ( !($('#flexCheckChecked').is(":checked"))){
            return modal('Вы не подтвердили обработку персональных данных!')
        }   
        const data = new FormData()
        await data.append('passport', file)

        const data2 = new FormData()
        await data2.append('passport', file2)

        result = ''

        await axios.post('https://lk.mta-donskoy.ru/load_passport?type=Представитель', data2, {
            timeout: 4000
        }).then(
            (response) => {
                console.log(response.data.message);
            }
        ).catch(error => {
            if (error.response) {
                const errors = error.response.data.errors;
                if (errors.length == 1){
                    result = result + errors[0].msg;
                }else{
                    errors.forEach(element => {
                        result = result + '<p>• ' + element.msg + '</p>';
                    })
                }
            }else{
                result = result + error;
            }
        });
        if(result != ''){
            modal(result)
            return;
        }

        await axios.post('https://lk.mta-donskoy.ru/load_passport?type=Игрок', data, {
            timeout: 4000
        }).then(
            (response) => {
                console.log(response.data.message);
                result = 'Вы успешно отправили анкету на подтверждение!'
                setTimeout(() => document.location.href='/form/1', 500)
            }
        ).catch(error => {
            if (error.response) {
                const errors = error.response.data.errors;
                if (errors.length == 1){
                    result = result + errors[0].msg;
                }else{
                    errors.forEach(element => {
                        result = result + '<p>• ' + element.msg + '</p>';
                    })
                }
            }else{
                result = result + error;
            }
        });
        if(result != ''){
            modal(result)
            return;
        }

/*
        await axios.post('https://lk.mta-donskoy.ru/load_passport' + ((p_i != null) ? '?player_id=' + p_i : ''), data, {
            timeout: 4000
        }).then(
            (response) => {
                console.log(response.data.message);
                result = 'Вы успешно отправили анкету на подтверждение!'
                setTimeout(() => document.location.href='/form/1' + ((p_i != null) ? '?player_id=' + p_i : ''), 500);
            }
        ).catch(error => {
            if (error.response) {
                const errors = error.response.data.errors;
                if (errors.length == 1){
                    result = result + errors[0].msg;
                }else{
                    errors.forEach(element => {
                        result = result + '<p>• ' + element.msg + '</p>';
                    })
                }
            }else{
                result = result + error;
            }
        });
        if(result != ''){
            modal(result)
            return;
        }*/
    })

    //------


    button.onclick = ()=>{
        input.click(); //if user click on the button then the input also clicked
    }

    input.addEventListener("change", function(){
        //getting user select file and [0] this means if user select multiple files then we'll select only the first one
        file = this.files[0];
        dropArea.classList.add("active");
        showFile(); //calling function
    });


    //If user Drag File Over DropArea
    dropArea.addEventListener("dragover", (event)=>{
        event.preventDefault(); //preventing from default behaviour
        dropArea.classList.add("active");
        dragText.textContent = "Отпустите, чтобы загрузить файл";
    });

    //If user leave dragged File from DropArea
    dropArea.addEventListener("dragleave", ()=>{
        dropArea.classList.remove("active");
        dragText.textContent = "Перетащите и отпустите, чтобы загрузить фото";
    });

    //If user drop File on DropArea
    dropArea.addEventListener("drop", (event)=>{
        event.preventDefault(); //preventing from default behaviour
        //getting user select file and [0] this means if user select multiple files then we'll select only the first one
        file = event.dataTransfer.files[0];
        showFile(); //calling function
    });

    function showFile(){
        let fileType = file.type; //getting selected file type
        let validExtensions = ["image/jpeg", "image/jpg", "image/png"]; //adding some valid image extensions in array
        if(validExtensions.includes(fileType)){ //if user selected file is an image file
            let fileReader = new FileReader(); //creating new FileReader object
            fileReader.onload = ()=>{
                let fileURL = fileReader.result; //passing user file source in fileURL variable
                //let imgTag = `<div class="vertical-center" style = "position: absolute; z-index: 999;"><button  class="btn btn-danger" ><i class="fas fa-cloud-upload-alt"></i></button></div><img src="${fileURL}" alt="">`; //creating an img tag and passing user selected file source inside src attribute
                let imgTag = `<img src="${fileURL}" alt="">`; //creating an img tag and passing user selected file source inside src attribute
                dropArea.innerHTML = imgTag; //adding that created img tag inside dropArea container
                img = dropArea.querySelector("img");
                img.onclick = ()=>{
                    input.click(); //if user click on the button then the input also clicked
                }
            }
            fileReader.readAsDataURL(file);
        }else{
            alert("This is not an Image File!");
            dropArea.classList.remove("active");
            dragText.textContent = "Перетащите и отпустите, чтобы загрузить фото";
        }
    }

    button2.onclick = ()=>{
        input2.click(); //if user click on the button then the input also clicked
    }

    input2.addEventListener("change", function(){
        //getting user select file and [0] this means if user select multiple files then we'll select only the first one
        file2 = this.files[0];
        dropArea2.classList.add("active");
        showFile2(); //calling function
    });


    //If user Drag File Over DropArea
    dropArea2.addEventListener("dragover", (event)=>{
        event.preventDefault(); //preventing from default behaviour
        dropArea2.classList.add("active");
        dragText2.textContent = "Отпустите, чтобы загрузить файл";
    });

    //If user leave dragged File from DropArea
    dropArea2.addEventListener("dragleave", ()=>{
        dropArea2.classList.remove("active");
        dragText2.textContent = "Перетащите и отпустите, чтобы загрузить фото";
    });

    //If user drop File on DropArea
    dropArea2.addEventListener("drop", (event)=>{
        event.preventDefault(); //preventing from default behaviour
        //getting user select file and [0] this means if user select multiple files then we'll select only the first one
        file2 = event.dataTransfer.files[0];
        showFile2(); //calling function
    });

    function showFile2(){
        let fileType = file2.type; //getting selected file type
        let validExtensions = ["image/jpeg", "image/jpg", "image/png"]; //adding some valid image extensions in array
        if(validExtensions.includes(fileType)){ //if user selected file is an image file
            let fileReader = new FileReader(); //creating new FileReader object
            fileReader.onload = ()=>{
                let fileURL = fileReader.result; //passing user file source in fileURL variable
                //let imgTag = `<div class="vertical-center" style = "position: absolute; z-index: 999;"><button  class="btn btn-danger" ><i class="fas fa-cloud-upload-alt"></i></button></div><img src="${fileURL}" alt="">`; //creating an img tag and passing user selected file source inside src attribute
                let imgTag = `<img src="${fileURL}" alt="">`; //creating an img tag and passing user selected file source inside src attribute
                dropArea2.innerHTML = imgTag; //adding that created img tag inside dropArea container
                img = dropArea2.querySelector("img");
                img.onclick = ()=>{
                    input2.click(); //if user click on the button then the input also clicked
                }
            }
            fileReader.readAsDataURL(file2);
        }else{
            alert("This is not an Image File!");
            dropArea2.classList.remove("active");
            dragText2.textContent = "Перетащите и отпустите, чтобы загрузить фото";
        }
    }
})