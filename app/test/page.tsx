'use client'

import { useState } from 'react';
import { useAppKitProvider, useAppKitAccount } from "@reown/appkit/react"
import { ethers } from 'ethers';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const { walletProvider } = useAppKitProvider()
  const { address, isConnected } = useAppKitAccount()

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isConnected) {
      alert('Please connect your wallet first!');
      return;
    }

    setIsLoading(true);
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/generate-nft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          wallet: account
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error generating NFT:', error);
      alert('Error generating NFT. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-8">
          NFT Generator
        </h1>

            <w3m-button />

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label 
              htmlFor="prompt" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Enter your NFT prompt
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              required
              placeholder="Describe your NFT..."
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !isConnected}
            className="w-full bg-green-600 text-white rounded-md px-4 py-2 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400"
          >
            {isLoading ? 'Generating...' : 'Generate NFT'}
          </button>
        </form>

        {result && (
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h2 className="text-lg font-semibold mb-2">Result:</h2>
            <pre className="whitespace-pre-wrap text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}