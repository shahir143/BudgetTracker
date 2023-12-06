let form = document.querySelector("#myForm");
let itemList = document.querySelector("#itemList");

const userExpenses = document.getElementById('expenses');
const userDescription = document.getElementById('description');
const userCategory = document.getElementById('category');
const token = localStorage.getItem('token');

form.addEventListener('submit', saveData)
async function saveData(e){
    e.preventDefault();
    let obj = {
        Expenses: userExpenses.value,
        Description: userDescription.value, 
        Category: userCategory.value, 
    }
    try {
        const response = await axios.post(`http://localhost:4000/expense/addExpense`,obj,{
            headers: {
            Authorization: token
        }});
        console.log('Response from server:', response);
        const updatedData = response.data;
        displayExpenses(updatedData);
    } catch (error) {
        console.log('Error in saving form', error);
    }
    
    
};

function displayExpenses(data) { 
    console.log(data);
    let li = document.createElement('li');
    li.appendChild(document.createTextNode(`${data.Expenses} - ${data.Category} - ${data.Description} -`));
    let deleteBtn = document.createElement('button');
    deleteBtn.type="button";
    deleteBtn.className = "btn btn-danger";
    deleteBtn.id="deletebtn";
    deleteBtn.appendChild(document.createTextNode("Delete"));
    

    let editBtn = document.createElement('button');
    editBtn.className = 'btn btn-info';
    editBtn.id='edit';
    editBtn.appendChild(document.createTextNode("Edit"));
    
    
    deleteBtn.onclick=async(e) => {
        const target = e.target.parentElement;
        const id=data.id;
        try{
            const user=await axios.delete(`http://localhost:4000/expense/delExpense/${id}`);
            itemList.removeChild(target);
        }catch(error){
            console.log(error,"error in deleting ")
        }
    };

    editBtn.onclick=  async (e) => {
        const target = e.target.parentElement;
        const id = data.id; 
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
    li.appendChild(deleteBtn);
    li.appendChild(editBtn);
    itemList.appendChild(li);
}
document.addEventListener('DOMContentLoaded', displayData)
async function displayData() {
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
