// Local Storage Keys
const ACCOUNTS_KEY = 'spendManager_accounts';

// Account Operations
export const getAccounts = () => {
  const accounts = localStorage.getItem(ACCOUNTS_KEY);
  return accounts ? JSON.parse(accounts) : [];
};

export const saveAccount = (account) => {
  const accounts = getAccounts();
  accounts.push({
    ...account,
    id: Date.now().toString(),
    payments: [],
  });
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  return accounts;
};

export const deleteAccount = (account_id) => {
  const accounts = getAccounts();
  const updatedAccounts = accounts.filter(account => account.id !== account_id);
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(updatedAccounts));
  return updatedAccounts;
};

export const clearTransations=(account_id)=>{
  const accounts = getAccounts();
  const updatedAccounts = accounts.map((account) => {
    if(account.id === account_id) {
      account.payments = [];
    }
    return account;
  } );
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(updatedAccounts));
}

export const getAccountById = (accountId) => {
  const accounts = getAccounts();
  return accounts.find(account => account.id === accountId);
};

export const addPayment = (accountId, payment) => {
  const accounts = getAccounts();
  const accountIndex = accounts.findIndex(account => account.id === accountId);
  
  if (accountIndex !== -1) {
    accounts[accountIndex].payments.push({
      ...payment,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    });
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  }
  
  return accounts[accountIndex];
}; 