const myform=document.getElementById('my-Form');
const userEmail=document.getElementById('Email');

myform.addEventListener('submit', resetPass);

async function resetPass(e){
    e.preventDefault();
    try{
        const reset={
            email:userEmail.value,
        }
        const response=await axios.post("http://localhost:4000/password/resetpassword",reset);
        console.log(response.data);
        if(response.status===200){
            alert("check your mail");
        }
    }catch(e){
        console.log(e);
    }
}