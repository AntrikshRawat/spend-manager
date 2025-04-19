import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAccountById, addPayment,clearTransations } from '../utils/localStorage';
import Modal from './Modal';

export default function Account() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPayment, setNewPayment] = useState({
    name: '',
    amount: '',
    where: '',
  });

  useEffect(() => {
    const loadedAccount = getAccountById(id);
    if (loadedAccount) {
      setAccount(loadedAccount);
    } else {
      navigate('/');
    }
  }, [id, navigate]);

  const handleAddPayment = (e) => {
    e.preventDefault();
    if (newPayment.name && newPayment.amount && newPayment.where) {
      const updatedAccount = addPayment(id, {
        ...newPayment,
        amount: parseFloat(newPayment.amount),
      });
      setAccount(updatedAccount);
      setNewPayment({ name: '', amount: '', where: '' });
      setIsModalOpen(false);
    }
  };

  const clearPayments = ()=>{
    clearTransations(account.id);
    let updatedAccount = getAccountById(id);
    setAccount(updatedAccount);
  }
  if (!account) return null;

  const totalSpent = account.payments.reduce((sum, payment) => sum + payment.amount, 0);
  const person1Total = account.payments
    .filter(payment => payment.name === account.person1)
    .reduce((sum, payment) => sum + payment.amount, 0);
  const person2Total = account.payments
    .filter(payment => payment.name === account.person2)
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="min-h-screen bg-[#68b0ab] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="font-bold text-indigo-700"
          >
            ← Back to Home
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-all duration-200"
          >
            Add Payment
          </button>
          <button
            onClick={clearPayments}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-200"
          >
            Clear All
          </button>
        </div>

        <div className="bg-[#faf3dd] rounded-2xl shadow-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-[#68b0ab] mb-4">
            {`${account.person1}`.charAt(0).toUpperCase() + `${account.person1}`.slice(1)} & {`${account.person2}`.charAt(0).toUpperCase() + `${account.person2}`.slice(1)}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-100 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-xl font-semibold text-indigo-600">₹{totalSpent.toFixed(2)}</p>
            </div>
            <div className="bg-slate-100 p-4 rounded-lg">
              <p className="text-sm text-gray-500">{`${account.person1}`.charAt(0).toUpperCase() + `${account.person1}`.slice(1)}'s Total</p>
              <p className="text-xl font-semibold text-emerald-600">₹{person1Total.toFixed(2)}</p>
            </div>
            <div className="bg-slate-100 p-4 rounded-lg">
              <p className="text-sm text-gray-500">{`${account.person2}`.charAt(0).toUpperCase() + `${account.person2}`.slice(1)}'s Total</p>
              <p className="text-xl font-semibold text-emerald-600">₹{person2Total.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#faf3dd] rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment History</h2>
          <div className="space-y-4">
            {account.payments.map((payment) => (
              <div
                key={payment.id}
                className="border-b border-gray-200 pb-4 last:border-0 last:pb-0"
              >
                <div className="flex justify-between items-start">
                    <p className="font-md text-gray-900">{payment.where}</p>
                    <p className="text-md text-gray-500">Paid by {payment.name}</p>
                    <p className="text-md text-gray-500">Paid on {`${payment.date}`.slice(0,10)}</p>
                  <p className="text-md font-semibold text-indigo-600">
                    ₹{payment.amount.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Add New Payment"
        >
          <form onSubmit={handleAddPayment} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Who Paid
              </label>
              <select
                id="name"
                value={newPayment.name}
                onChange={(e) => setNewPayment({ ...newPayment, name: e.target.value })}
                className="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                <option value="">Select person</option>
                <option value={account.person1}>{account.person1}</option>
                <option value={account.person2}>{account.person2}</option>
              </select>
            </div>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Amount
              </label>
              <input
                type="number"
                id="amount"
                step="0.01"
                value={newPayment.amount}
                onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="where" className="block text-sm font-medium text-gray-700">
                Where
              </label>
              <input
                type="text"
                id="where"
                value={newPayment.where}
                onChange={(e) => setNewPayment({ ...newPayment, where: e.target.value })}
                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="mt-5 sm:mt-6">
              <button
                type="submit"
                className="inline-flex w-full justify-center rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Add Payment
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
} 