let totalIncome = 0;
let totalExpenses = 0;
let savingsAmount = 0;
let totalSavings = 0;
let month = "";
let userName = "";
let monthsData = [];
let allUsersData = {};

function login() {
    userName = document.getElementById('username').value;
    if (userName) {
        localStorage.setItem('userName', userName);
        document.getElementById('userDisplay').innerText = userName;
        showPage('incomePage');
    } else {
        alert("Please enter a valid username.");
    }
}

function calculateExpenses() {
    month = document.getElementById('month').value;
    totalIncome = parseFloat(document.getElementById('income').value) || 0;

    const grocery = parseFloat(document.getElementById('grocery').value) || 0;
    const rent = parseFloat(document.getElementById('rent').value) || 0;
    const laundry = parseFloat(document.getElementById('laundry').value) || 0;
    const eb = parseFloat(document.getElementById('eb').value) || 0;
    const emi = parseFloat(document.getElementById('emi').value) || 0;
    const tuition = parseFloat(document.getElementById('tuition').value) || 0;
    const entertainment = parseFloat(document.getElementById('entertainment').value) || 0;
    const homeLoan = parseFloat(document.getElementById('homeLoan').value) || 0;

    totalExpenses = grocery + rent + laundry + eb + emi + tuition + entertainment + homeLoan;

    showPage('savingsPage');
}

function calculateSavings() {
    savingsAmount = parseFloat(document.getElementById('savingsAmount').value) || 0;

    totalSavings = totalIncome - totalExpenses - savingsAmount;

    document.getElementById('summaryIncome').innerText = totalIncome;
    document.getElementById('summaryExpenses').innerText = totalExpenses;
    document.getElementById('summarySavings').innerText = savingsAmount;
    document.getElementById('summaryTotalSavings').innerText = totalSavings;
    document.getElementById('summaryMonth').innerText = month;

    // Save data
    const data = {
        month,
        income: totalIncome,
        expenses: totalExpenses,
        savings: savingsAmount,
        totalSavings
    };
    if (!allUsersData[userName]) {
        allUsersData[userName] = [];
    }
    allUsersData[userName].push(data);
    localStorage.setItem('allUsersData', JSON.stringify(allUsersData));

    showPage('summaryPage');
}

function showGraph() {
    showPage('analysisPage');

    const ctx = document.getElementById('savingsChart').getContext('2d');
    const userMonths = allUsersData[userName].map(data => data.month);
    const userSavings = allUsersData[userName].map(data => data.totalSavings);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: userMonths,
            datasets: [{
                label: `${userName}'s Total Savings`,
                data: userSavings,
                backgroundColor: 'rgba(0, 150, 136, 0.6)',
                borderColor: 'rgba(0, 150, 136, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true
        }
    });
}

function addNewUser() {
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    showPage('loginPage');
}

function finish() {
    const allUsers = Object.keys(allUsersData);
    const ctx = document.getElementById('savingsChart').getContext('2d');
    const datasets = allUsers.map(user => {
        return {
            label: `${user}'s Savings`,
            data: allUsersData[user].map(data => data.totalSavings),
            backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`,
            borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
            borderWidth: 1
        };
    });

    const months = allUsersData[allUsers[0]].map(data => data.month);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months,
            datasets
        },
        options: {
            responsive: true
        }
    });
}

function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

window.onload = function() {
    allUsersData = JSON.parse(localStorage.getItem('allUsersData')) || {};
    showPage('loginPage');
};
