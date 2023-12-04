const myForm=document.getElementById('my-Form');
const useremail=document.getElementById('Email');
const userPassword=document.getElementById('Password');

myForm.addEventListener('submit',async(e)=>{
    e.preventDefault();
    try{
        const loginData={
            email:useremail.value,
            password:userPassword.value
        }
        console.log(loginData)
        const login=await axios.post('http://localhost:4000/user/login',loginData);
        alert(login.data.message);
    }catch(err){
        console.log(err);
    }
})