
import './App.css'
import { abi } from './blockchain/abi/erc20.abi'
import { writeContract } from 'wagmi/actions'
import { config } from './blockchain/config/config'
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  
  const [amount, setAmount] = useState(0);
  const [hash, setHash] = useState('');

  const useSendTransaction = async ()=>{

    const amountInWei = BigInt(Number(amount) * 10 ** 18); // Convert to BigInt with 18 decimals

    const result = await writeContract(config, {
      abi,
      address: '0x6d35d577Eab04AB6A0882b9F9dBdaf04b2c65810', // token address
      functionName: 'transfer',
      args: [
        '0x61A4D46C29Af78F9FADF093864e5aeb660cC2ab3',  // Recipient
        amountInWei,  // Amount (10 tokens with 18 decimals)
      ],
    });

    console.log(result);
    setHash(result);

  }

  async function getverification (hash: string) {
    try {
      const response = await axios.post("http://localhost:8080/api/transaction/verify-new", {
        hash,
        planType: "Basic",
      },
      {
        withCredentials: true, 
        headers: { "Content-Type": "application/json" },
      })
      console.log('Verification:', response.data)
    } catch (error) {
      console.log('Verification Error:', error);
      
    }
  }


  useEffect(()=>{
    if(hash){
      getverification(hash);
    }
  },[hash]);

  return (
    <>
      <input 
        type="number" 
        value={amount}
        onChange={(e)=>setAmount(Number(e.target.value))} />
      <br />
      
      <button 
        onClick={useSendTransaction}
      >
        Send
      </button>
      
    </>
  )
}

export default App
