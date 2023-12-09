let form = document.querySelector("#expense-button");
let itemList = document.querySelector("#user-list");

const userExpenses = document.getElementById('expenses');
const userDescription = document.getElementById('description');
const userCategory = document.getElementById('category');
const premiumBtn=document.getElementById('premium-button');
const premiumDiv=document.getElementById('premium-div');
const logoutBtn=document.getElementById('logout');

window.addEventListener('DOMContentLoaded', loadServer);
form.addEventListener('click', saveData);
premiumBtn.addEventListener("click",premium);
logoutBtn.addEventListener("click",serverOut);
async function serverOut(e) {
    localStorage.clear();

    const logout = confirm("Are you sure you want to logout?");
    if (logout) {
        window.location.href = '../login/login.html';
    }
}

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
        const target = e.target.parentElement;
        const id=data.id;
        const token = localStorage.getItem('token');
        try{
            const user=await axios.delete(`http://localhost:4000/expense/delExpense/${id}`,{
                headers: {
                    Authorization: token
                }
            });
            itemList.removeChild(target);
        }catch(error){
            console.log(error,"error in deleting ")
        }
    };

    editBtn.onclick=  async (e) => {
        const target = e.target.parentElement;
        const id = data.id; 
        const token = localStorage.getItem('token');
        try{
            userExpenses.value=data.Expenses;
            userDescription.value=data.Description;
            userCategory.value=data.Category;
            
            const user=await axios.delete(`http://localhost:4000/expense/delExpense/${id}`);
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
                const premiumData=updateData.data.data.Premium;
                localStorage.setItem("premium",premiumData);
                if (localStorage.getItem("premium") === 'true') {
                    premiumDiv.innerHTML = `<h3>Premium User</h3>`;
                    premiumBtn.removeEventListener("click", premiumRazor);
                    premiumBtn.disabled = true;
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
        

async function loadServer(e){
    e.preventDefault();
    try{
        const premiumStatus=localStorage.getItem('premium');
        if(premiumStatus==="true"){
            premiumDiv.innerHTML = `<h3>Premium User</h3>`;
            premiumBtn.removeEventListener("click", premiumRazor);
            premiumBtn.disabled = true;
        }
        displayData();
    }catch(e){
        console.log(e);
    }
}
async function displayData() {
    const token = localStorage.getItem('token');
    try {
        
        const dBdata = await axios.get('http://localhost:4000/expense/Expenses', {
            headers: {
                Authorization: token
            }
        });

        const usersData = dBdata.data;
        console.log(usersData);

        if (usersData.length < 1) {
            console.log("No users");
        } else {
            for (let i = 0; i < usersData.length; i++) {
                displayExpenses(usersData[i]);
            }
        }
    } catch (error) {
        console.error(error);
    }
}
