import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAccounts, saveAccount ,deleteAccount} from '../utils/localStorage';
import Modal from './Modal';

export default function Home() {
  const [accounts, setAccounts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAccount, setNewAccount] = useState({ person1: '', person2: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const loadedAccounts = getAccounts();
    setAccounts(loadedAccounts);
  }, []);

  const handleCreateAccount = (e) => {
    e.preventDefault();
    if (newAccount.person1 && newAccount.person2) {
      saveAccount(newAccount);
      setAccounts(getAccounts());
      setNewAccount({ person1: '', person2: '' });
      setIsModalOpen(false);
    }
  };

  const handleDelete = (accountId)=>{
    const newAccounts = deleteAccount(accountId);
    setAccounts(newAccounts);
  }

  return (
    <div className="min-h-screen bg-[#68b0ab] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="md:text-3xl text-xl font-bold text-[#faf3dd]">Money Spending Manager</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-500 text-sm md:text-xl text-white p-3 rounded-lg hover:bg-indigo-600 transition-all duration-200"
          >
            Create New Account
          </button>
        </div>

        <div className="grid gap-4">
          {accounts.length ===0 &&(
            <>
            <div className='bg-[#faf3dd] p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer'>No Accounts</div>
            </>
          )}
          {accounts.map((account) => (
            <div
              key={account.id}
              onClick={() => navigate(`/account/${account.id}`)}
              className="bg-[#faf3dd] p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="md:text-xl text-[#68b0ab] font-bold hover:brightness-105">
                    {`${account.person1}`.toUpperCase()} & {`${account.person2}`.toUpperCase()}
                  </h2>
                  <p className="text-[#4a7c59] mt-1">
                    {account.payments.length} payments recorded
                  </p>
                </div>
                <span className='flex'>
                <div className="text-right">
                  <p className="md:text-sm text-gray-500">Total Spent</p>
                  <p className="text-lg font-semibold text-indigo-600">
                  ₹{account.payments.reduce((sum, payment) => sum + payment.amount, 0).toFixed(2)}
                  </p>
                </div>
                <button className='bg-red-400 rounded-xl py-2 px-3 m-2' onClick={()=>{handleDelete(account.id)}}>Delete</button>
                </span>
              </div>
            </div>
          ))}
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create New Account"
        >
          <form onSubmit={handleCreateAccount} className="space-y-4">
            <div>
              <label htmlFor="person1" className="block text-sm font-medium text-gray-700">
                Person 1 Name
              </label>
              <input
                type="text"
                id="person1"
                value={newAccount.person1}
                onChange={(e) => setNewAccount({ ...newAccount, person1: e.target.value })}
                className="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="person2" className="block text-sm font-medium text-gray-700">
                Person 2 Name
              </label>
              <input
                type="text"
                id="person2"
                value={newAccount.person2}
                onChange={(e) => setNewAccount({ ...newAccount, person2: e.target.value })}
                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="mt-5 sm:mt-6">
              <button
                type="submit"
                className="inline-flex w-full justify-center rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Create Account
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
} 