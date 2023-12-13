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
        const signup=await axios.post('/user/signup',signupData);
       alert(signup.data.message);
       window.location.href='../login/login.html'
       console.log(signup.data)
        myForm.reset();
    }catch(err){
        console.log(err);
    }
})