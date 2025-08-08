import { useState } from 'react';

const FilterDropdown = ({ onFilter }) => {
  const [email, setEmail] = useState('');
  const [policy, setPolicy] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const handleApply = () => {
    onFilter({ email, policy, fromDate, toDate });
  };

  return (
    <div className="bg-base-100 p-4 rounded-lg shadow-md mb-6 w-full md:w-2/3 mx-auto">
      <h3 className="text-lg font-bold mb-2">🔍 Filter Transactions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="email"
          placeholder="User Email"
          className="input input-bordered w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Policy Name"
          className="input input-bordered w-full"
          value={policy}
          onChange={(e) => setPolicy(e.target.value)}
        />
        <input
          type="date"
          className="input input-bordered w-full"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
        <input
          type="date"
          className="input input-bordered w-full"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
      </div>
      <div className="mt-4 text-right">
        <button onClick={handleApply} className="btn btn-primary btn-sm">
          Apply Filter
        </button>
      </div>
    </div>
  );
};

export default FilterDropdown;
