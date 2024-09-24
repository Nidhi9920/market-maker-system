import React, { useState } from 'react';
import axios from 'axios';

function App() {
  // State variables for input fields and logs
  const [distributionNumber, setDistributionNumber] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [log, setLog] = useState([]);

  // Handler for volume creation
  const createVolume = async () => {
    try {
      const response = await axios.post('http://localhost:5001/volume', {
        distributionNumber,
        totalTransactions,
      });
      console.log(distributionNumber)
      console.log(totalTransactions)
      setLog([...log, `Volume created successfully: ${response.data[0].message}`]);
    } catch (error) {
      setLog([...log, `Error: ${error.message}`]);
    }
  };

  // Handler for collecting remaining SOL
  const collectSol = async () => {
    try {
      const response = await axios.post('http://localhost:5001/collectSol');
      setLog([...log, `SOL collected successfully: ${response.data[0].message}`]);
    } catch (error) {
      setLog([...log, `Error: ${error.message}`]);
    }
  };

  // Handler for closing SPL token accounts
  const closeSplAccounts = async () => {
    try {
      const response = await axios.post('http://localhost:5001/closeSpl');
      setLog([...log, `SPL token accounts closed: ${response.data[0].message}`]);
    } catch (error) {
      setLog([...log, `Error: ${error.message}`]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Token Volume Creation Tool</h1>

      {/* Volume Creation Section */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-4">Volume Creation</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Distribution Number (Wallets)
          </label>
          <input
            type="number"
            value={distributionNumber}
            onChange={(e) => setDistributionNumber(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            placeholder="Enter number of wallets"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Total Transactions (Buy/Sell Orders)
          </label>
          <input
            type="number"
            value={totalTransactions}
            onChange={(e) => setTotalTransactions(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            placeholder="Enter total transactions"
          />
        </div>
        <button
          onClick={createVolume}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create Volume
        </button>
      </div>

      {/* Remaining SOL Collection Section */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-4">Collect Remaining SOL</h2>
        <button
          onClick={collectSol}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Collect SOL
        </button>
      </div>

      {/* SPL Account Closure Section */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-4">Close SPL Token Accounts</h2>
        <button
          onClick={closeSplAccounts}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Close SPL Accounts
        </button>
      </div>

      {/* Log Section */}
      <div className="bg-gray-200 p-4 rounded mt-4">
        <h2 className="text-xl font-bold mb-2">Logs</h2>
        <ul>
          {log.map((entry, index) => (
            <li key={index} className="text-sm text-gray-700">
              {entry}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
