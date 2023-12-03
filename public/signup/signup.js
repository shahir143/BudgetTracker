const myForm=document.getElementById('my-Form');
const username =document.getElementById('Name');
const useremail=document.getElementById('Email');
const userPassword=document.getElementById('password');

myForm.addEventListener('submit',async(e)=>{
    e.preventDefault();
    try{
        const signupData={
            name:username.value,
            email:useremail.value,
            password:userPassword.value
        }
        const signup=await axios.post('http://localhost:4000/user/signup',signupData);
        if(signup.status===200){
            alert(signup.data.message);
        }else{
            alert(signup.data.message);
        }
    }catch(err){
        console.log(err);
    }
})