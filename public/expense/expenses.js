const form = document.querySelector("#expense-button");
const itemList = document.querySelector("#user-list");
const userExpenses = document.getElementById('expenses');
const userDescription = document.getElementById('description');
const userCategory = document.getElementById('category');
const premiumBtn = document.getElementById('premium-button');
const premiumDiv = document.getElementById('premium-div');
const logoutBtn = document.getElementById('logout');
const closeBtn = document.getElementById('closeModal');
const premiumText = document.getElementById('leaderBtn');

const leaderBoard = document.getElementById('showLeaderboard');
const downloadList = document.getElementById('Downloadboard');
const showleader = document.getElementById('leaderboardModal');
const boardList = document.getElementById('leaderboardList');

window.addEventListener('DOMContentLoaded', displayData);
form.addEventListener('click', saveData);
premiumBtn.addEventListener("click", premium);
logoutBtn.addEventListener("click", serverOut);
leaderBoard.addEventListener("click", showBoard);
downloadList.addEventListener('click', showDownloadList);
closeBtn.addEventListener('click', closeList);

async function saveData(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const obj = { Expenses: userExpenses.value, Description: userDescription.value, Category: userCategory.value };
    try {
        const { data } = await axios.post(`/expense/addExpense`, obj, {
             headers: { Authorization: token } 
            });
        displayExpenses(data.data);
    } catch (error) {
        console.error('Error in saving form', error);
    }
}

function displayExpenses(data) {
    console.log(data);
    let li = document.createElement('li');
    li.className = "list-group-item";
    li.textContent = `${data.Expenses} - ${data.Category} - ${data.Description} -`;

    let div = document.createElement('div');
    div.className = "button-group";

    let deleteBtn = createButton("DELETE", "btn btn-danger");
    deleteBtn.textContent="DELETE"
    let editBtn = createButton("Edit", "btn btn-info");
    editBtn.id = 'edit';
    editBtn.textContent="EDIT";

    div.appendChild(deleteBtn);
    div.appendChild(editBtn);
    li.appendChild(div);

    deleteBtn.onclick = async (e) => {
        const target = e.target.parentElement.parentElement;
        const id = data.id;
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`/expense/delExpense/${id}`, {
                headers: {
                    Authorization: token
                }
            });
            itemList.removeChild(target);
        } catch (error) {
            console.log(error, "error in deleting ");
        }
    };

    editBtn.onclick = async (e) => {
        userExpenses.value = data.Expenses;
        userDescription.value = data.Description;
        userCategory.value = data.Category;
        const target = e.target.parentElement.parentElement;
        const id = data.id;
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`/expense/delExpense/${id}`, {
                headers: {
                    Authorization: token
                }
            });
            itemList.removeChild(target);
        } catch (error) {
            console.log(error, "error in deleting ");
        }
    };

    itemList.appendChild(li);
}

function createButton(text, className) {
    const button = document.createElement('button');
    button.type = "button";
    button.className = className;
    button.textContent = text;
    return button;
}


async function premium(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
        const { data } = await axios.get('/purchase/premiumMember', { 
            headers: { Authorization: token } 
        });
        premiumRazor(data);
    } catch (error) {
        console.error(error);
    }
}

const premiumRazor = async (data) => {
    try {
        
        const options = { 
            key: data.key_id, 
            order_Id: data.orderData.orderId, 
            handler: async (response) => handlePremiumPayment(response, data) 
        };
        const rzpl = new window.Razorpay(options);
        await rzpl.open();
        rzpl.on('payment.failed', (failedData) => console.log(failedData) || alert("SOMETHING WENT WRONG"));
    } catch (error) {
        console.error(error);
    }
};

async function handlePremiumPayment(response, data) {
    const token = localStorage.getItem('token');
    const updateData = await axios.post('/purchase/updatedTransactionstatus', {
        order_id: data.orderData.orderId,
        payment_id: response.razorpay_payment_id,
    }, { headers: { Authorization: token } });

    const premiumData = updateData.data.data.Premium;
    localStorage.setItem("premium", premiumData);

    if (premiumData) {
        premiumDiv.innerHTML = `<h4 id="premium_user">Premium User</h4>`;
        premiumBtn.removeEventListener("click", premiumRazor);
        premiumBtn.disabled = true;
        downloadList.style.display="block";
        leaderBoard.style.display = "block";
        showleader.style.display = "block";
    }

    alert("You are a premium user");
};

async function displayData() {
    try {
        const { data } = await axios.get('/expense/Expenses', { headers: { 
            Authorization: localStorage.getItem('token') 
        } });
        const premiumStatus = data.isPremium;
        localStorage.setItem("premium", premiumStatus);
        console.log(data.userLogin)
        if (!premiumStatus) {
            premiumText.innerHTML = `<h4 id="premium_text">Join Premium </h4>`;
            downloadList.style.display="none";
            leaderBoard.style.display = "none";
            showleader.style.display = "none";
        } else {
            premiumDiv.innerHTML = `<h4 id="premium_user">Premium User</h4>`;
            premiumBtn.removeEventListener("click", premiumRazor);
            premiumBtn.disabled = true;
        }
        const usersData = data.data;
        for (let i = 0; i < usersData.length; i++) {
            displayExpenses(usersData[i]);
        }
    } catch (error) {
        console.error(error);
    }
}

async function showBoard() {
    showleader.style.display = "block";
    displayLeaderboard();
}

function closeList() {
    showleader.style.display = "none";
    boardList.innerHTML = "";
}
function showDownloadList() {
    downloadList.style.display = "none";
    boardList.innerHTML = "";
}

async function displayLeaderboard() {
    try {
        const { data } = await axios.get('/premium/leaderboard', { headers: { Authorization: localStorage.getItem('token') } });
        boardList.innerHTML = "";
        data.leaderBoard.forEach((item) => {
            if (item.premium) {
                const li = document.createElement('li');
                li.textContent = `Name : ${item.userName}- Expenses: Rs.${item.totalexpenses}`;
                boardList.appendChild(li);
            }
        });
    } catch (error) {
        console.error(error);
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
