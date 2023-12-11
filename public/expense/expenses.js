let form = document.querySelector("#expense-button");
let itemList = document.querySelector("#user-list");

const userExpenses = document.getElementById('expenses');
const userDescription = document.getElementById('description');
const userCategory = document.getElementById('category');
const premiumBtn=document.getElementById('premium-button');
const premiumDiv=document.getElementById('premium-div');
const logoutBtn=document.getElementById('logout');
const closeBtn=document.getElementById('closeModal');
const premiumText=document.getElementById('leaderBtn');

const leaderBoard = document.getElementById('showLeaderboard');
const showleader = document.getElementById('leaderboardModal');
const boardList=document.getElementById('leaderboardList');

window.addEventListener('DOMContentLoaded', displayData);
form.addEventListener('click', saveData);
premiumBtn.addEventListener("click",premium);
logoutBtn.addEventListener("click",serverOut);
leaderBoard.addEventListener("click",showBoard);
closeBtn.addEventListener('click',closeList);


async function saveData(e){
    e.preventDefault();
    let obj = {
        Expenses: userExpenses.value,
        Description: userDescription.value, 
        Category: userCategory.value, 
    }
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`http://localhost:4000/expense/addExpense`,obj,{
            headers: {
            Authorization: token
        }});
        console.log('Response from server:', response);
        const updatedData = response.data.data;
        displayExpenses(updatedData);
    } catch (error) {
        console.log('Error in saving form', error);
    }  
};

function displayExpenses(data) { 
    console.log(data);
    let li = document.createElement('li');
    li.className="list-group-item"
    li.appendChild(document.createTextNode(`${data.Expenses} - ${data.Category} - ${data.Description} -`));
    let div = document.createElement('div');
    div.className="button-group";
    let deleteBtn = document.createElement('button');
    deleteBtn.type="button";
    deleteBtn.className = "btn btn-danger";
    deleteBtn.id="deletebtn";
    deleteBtn.appendChild(document.createTextNode("Delete"));
    

    let editBtn = document.createElement('button');
    editBtn.className = 'btn btn-info';
    editBtn.id='edit';
    editBtn.appendChild(document.createTextNode("Edit"));
    div.appendChild(deleteBtn);
    div.appendChild(editBtn);
    li.appendChild(div);
    
    deleteBtn.onclick=async(e) => {
        const target = e.target.parentElement.parentElement;
        const id=data.id;
        const token = localStorage.getItem('token');
        try{
            const user=await axios.delete(`http://localhost:4000/expense/delExpense/${id}`,{
                headers: {
                    Authorization: token
                }
            });
            console.log(target)
            itemList.removeChild(target);
        }catch(error){
            console.log(error,"error in deleting ")
        }
    };

    editBtn.onclick=  async (e) => {
        const target = e.target.parentElement.parentElement;
        const id = data.id; 
        const token = localStorage.getItem('token');
        try{
            userExpenses.value=data.Expenses;
            userDescription.value=data.Description;
            userCategory.value=data.Category;
            
            const user=await axios.delete(`http://localhost:4000/expense/delExpense/${id}`,{headers: {
                Authorization: token
            }});
            itemList.removeChild(target);
        }catch(error){
            console.log(error,"error in editing ")
        }
    };
    
    itemList.appendChild(li);
}

async function premium(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get('http://localhost:4000/purchase/premiumMember', {
            headers: {
                Authorization: token
            }
        });
        premiumRazor(response.data);
        }catch (error) {
             console.error(error);
        }
};

const premiumRazor = async (data) => {
    try{
        const token = localStorage.getItem('token');
        var options = {
            key: data.key_id,
            order_Id: data.orderData.orderId,
            handler: async function (response) {
                console.log("RESPONSE IN HANDLER",response)
                const updateData=await axios.post('http://localhost:4000/purchase/updatedTransactionstatus', 
                {
                    order_id: data.orderData.orderId,
					payment_id: response.razorpay_payment_id,
                }, 
                { headers: { Authorization: token } },);
                console.log("updateData",updateData);
                const premiumData=updateData.data.data.Premium;
                localStorage.setItem("premium",premiumData);
                if (premiumData === true) {
                    premiumDiv.innerHTML = `<h4 id="premium_user">Premium User</h4>`;
                    premiumBtn.removeEventListener("click", premiumRazor);
                    premiumBtn.disabled = true;
                    leaderBoard.style.display="block";
                    showleader.style.display="block";
                }               
                alert("You are a premium user");
            }
        };

        const rzpl = new window.Razorpay(options);
        await rzpl.open();
        rzpl.on('payment.failed', async (failedData)=> {
            console.log(failedData);
            alert("SOMETHING WENT WRONG");
        });
    }catch (error) {
        console.error(error);
    }
};
        

async function displayData() {
    const token = localStorage.getItem('token');
    try {
        
        const dBdata = await axios.get('http://localhost:4000/expense/Expenses', {
            headers: {
                Authorization: token
            }
        });
        console.log(dBdata.data.userLogin);
        const usersData = dBdata.data;

        const premiumStatus = usersData.isPremium;
        localStorage.setItem("premium", premiumStatus);
        console.log("Premium Status:", premiumStatus);

        if (premiumStatus === false) {
            premiumText.innerHTML = `<h4 id="premium_text">Join Premium </h4>`;
            leaderBoard.style.display="none";
            showleader.style.display = "none"; 

        } else {
            premiumDiv.innerHTML = `<h4 id="premium_user">Premium User</h4>`;
            premiumBtn.removeEventListener("click", premiumRazor);
            premiumBtn.disabled = true;
        }
        
        for (let i = 0; i < usersData.length; i++) {
            displayExpenses(usersData[i]);
        }
    } catch (error) {
        console.error(error);
    }
}
async function showBoard(){
    showleader.style.display="block";
    displayLeaderboard();

}
async function closeList(){
    showleader.style.display="none";
    boardList.innerHTML="";
}
async function displayLeaderboard(){
    const token = localStorage.getItem('token');
    try{
        const boardData=await axios.get('http://localhost:4000/premium/leaderboard', {
            headers: {
                Authorization: token
            }
        });
        const userdata=boardData.data.leaderBoard;
        boardData.innerHTML="";
        userdata.forEach((data)=>{
            if(data.premium===true){
            const li=document.createElement('li');
            li.textContent=`Name : ${data.userName}- Expenses: Rs.${data.totalexpenses}`;
            boardList.appendChild(li)
            }   
        })
    }catch(err){
        console.log(err);
    }
}
async function serverOut(e) {
    e.preventDefault();
    localStorage.clear();
    const logout = confirm("Are you sure you want to logout?");
    if (logout) {
        window.location.href = '../login/login.html';
    }
}