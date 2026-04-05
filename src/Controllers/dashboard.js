import { getbeneficiaries, finduserbyaccount, findbeneficiarieByid } from "../Model/database.js";
const user = JSON.parse(sessionStorage.getItem("currentUser"));

// DOM elements
const greetingName = document.getElementById("greetingName");
const currentDate = document.getElementById("currentDate");
const solde = document.getElementById("availableBalance");
const incomeElement = document.getElementById("monthlyIncome");
const expensesElement = document.getElementById("monthlyExpenses");
const activecards = document.getElementById("activeCards");
const transactionsList = document.getElementById("recentTransactionsList");

const transferBtn = document.getElementById("quickTransfer");
const transferSection = document.getElementById("transferPopup");
const closeTransferBtn = document.getElementById("closeTransferBtn");
const cancelTransferBtn = document.getElementById("cancelTransferBtn");
const beneficiarySelect = document.getElementById("beneficiary");
const sourceCard = document.getElementById("sourceCard");
const submitTransferBtn = document.getElementById("submitTransferBtn");

// Guard
if (!user) {
  alert("User not authenticated");
  window.location.href = "/index.html";
}

// Events
transferBtn.addEventListener("click", handleTransfersection);
closeTransferBtn.addEventListener("click", closeTransfer);
cancelTransferBtn.addEventListener("click", closeTransfer);
submitTransferBtn.addEventListener("click", handleTransfer)


// Retrieve dashboard data
const getDashboardData = () => {
  const monthlyIncome = user.wallet.transactions
    .filter(t => t.type === "credit")
    .reduce((total, t) => total + t.amount, 0);

  const monthlyExpenses = user.wallet.transactions
    .filter(t => t.type === "debit")
    .reduce((total, t) => total + t.amount, 0);

  return {
    userName: user.name,
    currentDate: new Date().toLocaleDateString("fr-FR"),
    availableBalance: `${user.wallet.balance} ${user.wallet.currency}`,
    activeCards: user.wallet.cards.length,
    monthlyIncome: `${monthlyIncome} MAD`,
    monthlyExpenses: `${monthlyExpenses} MAD`,
  };
};

function renderDashboard() {
  const dashboardData = getDashboardData();
  if (dashboardData) {
    greetingName.textContent = dashboardData.userName;
    currentDate.textContent = dashboardData.currentDate;
    solde.textContent = dashboardData.availableBalance;
    incomeElement.textContent = dashboardData.monthlyIncome;
    expensesElement.textContent = dashboardData.monthlyExpenses;
    activecards.textContent = dashboardData.activeCards;
  }
  // Display transactions
  transactionsList.innerHTML = "";
  user.wallet.transactions.forEach(transaction => {
    const transactionItem = document.createElement("div");
    transactionItem.className = "transaction-item";
    transactionItem.innerHTML = `
    <div>${transaction.date}</div>
    <div>${transaction.amount} MAD</div>
    <div>${transaction.type}</div>
    <div>${transaction.etat}</div>
  `;
    transactionsList.appendChild(transactionItem);
  });

}
renderDashboard();

// Transfer popup
function closeTransfer() {
  transferSection.classList.remove("active");
  document.body.classList.remove("popup-open");
}

function handleTransfersection() {
  transferSection.classList.add("active");
  document.body.classList.add("popup-open");
}

// Beneficiaries
const beneficiaries = getbeneficiaries(user.id);

function renderBeneficiaries() {
  beneficiaries.forEach((beneficiary) => {
    const option = document.createElement("option");
    option.value = beneficiary.id;
    option.textContent = beneficiary.name;
    beneficiarySelect.appendChild(option);
  });
}
renderBeneficiaries();
function renderCards() {
  user.wallet.cards.forEach((card) => {
    const option = document.createElement("option");
    option.value = card.numcards;
    option.textContent = card.type + "****" + card.numcards;
    sourceCard.appendChild(option);
  });
}

renderCards();

//###################################  Transfer  #####################################################//

// check function 

/* function checkUser(numcompte, callback) {
  setTimeout(() => {
    const destinataire = finduserbyaccount(numcompte);
    if (destinataire) {
      callback(destinataire);
    } else {
      console.log("Destinataire non trouvé");
    }
  }, 500);
}

function checkSolde(exp, amount, callback) {
  setTimeout(() => {
    const solde = exp.wallet.balance;
    if (solde >= amount) {
      callback("Solde suffisant");
    } else {
      callback("Solde insuffisant");
    }
  }, 400);
}

function updateSolde(exp, destinataire, amount, callback) {
  setTimeout(() => {  
    exp.wallet.balance -= amount;
    destinataire.wallet.balance += amount;
    callback("Solde mis à jour");
  }, 300);
}


function addtransactions(exp, destinataire, amount, callback) {
  setTimeout(() => { 
    // Transaction pour l'expéditeur (débit)
    const transactionDebit = {
      id: Date.now(),
      type: "debit",
      amount: amount,
      from: exp.name,
      to: destinataire.name,
      date: new Date().toLocaleDateString()
    };

    // Transaction pour le destinataire (crédit)
    const transactionCredit = {
      id: Date.now() + 1,
      type: "credit",
      amount: amount,
      from: exp.name,
      to: destinataire.name,
      date: new Date().toLocaleDateString()
    };

    user.wallet.transactions.push(transactionDebit);
    destinataire.wallet.transactions.push(transactionCredit);
    renderDashboard();
    callback("Transaction enregistrée");
  }, 200);
}


export function transferer(exp, numcompte, amount) {
  console.log("\n DÉBUT DU TRANSFERT ");

  // Étape 1: Vérifier le destinataire
  checkUser(numcompte, function afterCheckUser(destinataire) {
    console.log("Étape 1: Destinataire trouvé -", destinataire.name);

    // Étape 2: Vérifier le solde
    checkSolde(exp, amount, function afterCheckSolde(soldemessage) {
      console.log(" Étape 2:", soldemessage);

      if (soldemessage.includes("Solde suffisant")) {
        // Étape 3: Mettre à jour les soldes
        updateSolde(exp, destinataire, amount, function afterUpdateSolde(updatemessage) {
          console.log(" Étape 3:", updatemessage);

          // Étape 4: Enregistrer la transaction
          addtransactions(exp, destinataire, amount, function afterAddTransactions(transactionMessage) {
            console.log(" Étape 4:", transactionMessage);
            console.log(`Transfert de ${amount} réussi!`);
          });
        });
      }
    });
  });
}


function handleTransfer(e) {
 e.preventDefault();
  const beneficiaryId = document.getElementById("beneficiary").value;
  const beneficiaryAccount=findbeneficiarieByid(user.id,beneficiaryId).account;
  const sourceCard = document.getElementById("sourceCard").value;

  const amount = Number(document.getElementById("amount").value);

  
  transferer(user, beneficiaryAccount, amount);

} */

function checkUser(numcompte) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const beneficiary = finduserbyaccount(numcompte);
      if (beneficiary)
        resolve(beneficiary);
      else
        reject("Beneficiary not found");
    }, 2000);
  })
}


function checkSolde(expediteur, amount) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (expediteur.wallet.balance > amount)
        resolve("Sufficient balance");
      else
        reject("Insufficient balance");
    }, 2000);
  })
}


function updateSolde(expediteur, destinataire, amount) {
  return new Promise((resolve) => {
    setTimeout(() => {
      expediteur.wallet.balance -= amount;
      destinataire.wallet.balance += amount;
      resolve("update balance done");
    }, 2000);
  })
}


function addtransactions(expediteur, destinataire, amount) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // create credit transaction
      const credit = {
        id: Date.now(),
        type: "credit",
        amount: amount,
        date: new Date().toISOString().slice(0, 10),
        from: expediteur.name
      }
      //create debit transaction
      const debit = {
        id: Date.now(),
        type: "debit",
        amount: amount,
        date: new Date().toISOString().slice(0, 10),
        to: destinataire.name,
      }
      expediteur.wallet.transactions.push(debit);
      destinataire.wallet.transactions.push(credit);
      resolve("transaction added successfully");
    }, 3000)
  })

}

// **************************************transfer***************************************************//

async function transfer(expediteur, numcompte, amount) {
  try{
    const dest = await checkUser(numcompte);
    const message = await checkSolde(expediteur,amount);
    const messagesolde = await updateSolde(expediteur,dest,amount);
    const messagetrans = await addtransactions(expediteur,dest,amount);
    renderDashboard(); 
  }catch(error){
    console.error(error);
  }
}


async function handleTransfer(e) {
  e.preventDefault();
  const beneficiaryId = document.getElementById("beneficiary").value;
  const beneficiaryAccount = findbeneficiarieByid(user.id, beneficiaryId).account;
  const sourceCard = document.getElementById("sourceCard").value;

  const amount = Number(document.getElementById("amount").value);

  await transfer(user, beneficiaryAccount, amount);

}

/*
    function func1(number,callback){
        console.log("start function");
       if(number%2===0){
        console.log("start callback");
        callback(number);
        console.log("end callback");
       }else{
        
       }
       console.log("end function");
    }

    function produit(number){
        console.log("the result is : ", (number*number));
    }

    func1(4,produit);
    */

/**********************************************************RECHARGE********************************************************************** */
const quickTopupBtn = document.getElementById("quickTopup");
const submitRechargeBtn = document.getElementById("submitRechargeBtn");

const rechargeCard = document.getElementById("rechargeCard");

const rechargePopup = document.getElementById("rechargePopup");

const closeRechargeBtn = document.getElementById("closeRechargeBtn");
const cancelRechargeBtn = document.getElementById("cancelRechargeBtn");

const rechargeAmount = document.getElementById("rechargeAmount");

//EVENTS
quickTopupBtn.addEventListener("click", openRecharge);
closeRechargeBtn.addEventListener("click", closeRecharge);
cancelRechargeBtn.addEventListener("click", closeRecharge);
submitRechargeBtn.addEventListener("click", handleRecharge);

const today = new Date();
const validcards = user.wallet.cards.filter(card => new Date(card.expiry) > today);

function checkPreconditions() {
  if (!user) {
    alert("user not authenticated");
    window.location.href = "/index.html";
  }

  else if (!user.wallet.cards || user.wallet.cards.length === 0) {
    console.log(user.wallet.cards);
    alert("no cards ");
    return false;
  }

  else if (!validcards || validcards.length === 0) {
    alert("vos cartes sont expirees");
    return false;
  }

  else {
    console.log("PreConditions verifer");
    return true;
  }
}

function openRecharge() {

  if (!checkPreconditions()) {
    return;
  }
  else {
    rechargePopup.classList.remove("recharge-hidden");
    rechargePopup.classList.add("recharge-visible");
  }
}

function closeRecharge() {
  rechargePopup.classList.remove("recharge-visible");
  rechargePopup.classList.add("recharge-hidden");
}

function renderCardsRecharge() {
  validcards.forEach((card) => {
    const option = document.createElement("option");
    option.value = card.numcards;
    option.textContent = card.type + "****" + card.numcards;
    rechargeCard.appendChild(option);
  });
}

renderCardsRecharge();

function checkMontant(amount) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (amount === "" || amount < 10 || amount > 5000) {
        reject("n'est pas un montant valide entre 10 et 5000");
        return;
      }

      resolve(amount);
    }, 2000);
  })
}

function updateRechargeSolde(expediteur, amount, selectedCard) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (selectedCard.balance < amount) {
        reject("Solde de la carte insuffisant");
        return;
      }

      expediteur.wallet.balance += amount;
      selectedCard.balance -= amount;
      resolve("Montant augmenter");
    }, 2000);
  })
}


function addRechargeTransaction(expediteur, amount, etat) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const transaction = {
        id: Date.now(),
        type: "recharge",
        etat: etat,
        amount: amount,
        date: new Date().toISOString().slice(0, 10),
        from: expediteur.wallet.selectedCard.numcards,
        to: expediteur.name
      }
      expediteur.wallet.transactions.push(transaction);
      resolve(transaction);
    }, 3000)
  })
}


async function recharge(amount) {
  let selectedCard = user.wallet.selectedCard;
  try {
    const validAmout = await checkMontant(amount);
    const message = await updateRechargeSolde(user, validAmout, selectedCard);
    const transaction = await addRechargeTransaction(user, amount, "success");
    renderDashboard();
  }
  catch(error){
    console.log(error);
    try{
      await addRechargeTransaction(user,amount,"echec");
      renderDashboard();
    }
    catch(error){
      console.log(error);
    }
  }
}


async function handleRecharge(e) {
  e.preventDefault();
  const amount = Number(rechargeAmount.value);
  const selectedCardNum = rechargeCard.value;
  user.wallet.selectedCard = user.wallet.cards.find(card => card.numcards === selectedCardNum);
  await recharge(amount);
}

submitRechargeBtn.addEventListener("click", handleRecharge);