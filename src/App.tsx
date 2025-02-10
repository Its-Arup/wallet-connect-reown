import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi' 
import { parseEther } from 'viem'
import axios from 'axios'
import './App.css'
import { useEffect } from 'react'

function App() {
  
  const { 
    data: hash, 
    isPending,
    sendTransaction 
  } = useSendTransaction() 

  async function submit(e: React.FormEvent<HTMLFormElement>) { 
    e.preventDefault() 
    console.log('submit');
    
    const formData = new FormData(e.target as HTMLFormElement) 
    const to = formData.get('address') as `0x${string}` 
    const value = formData.get('value') as string 
    sendTransaction({ to, value: parseEther(value)}) 
  } 

  const { isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })


  async function getverification (hash: string) {
    try {
      const response = await axios.post("http://localhost:8080/api/transaction/verify", {
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

  useEffect(() => {
    if (isConfirmed && hash) {
      getverification(hash)
    }
  }, [isConfirmed, hash])

  return (
    <>
      <form onSubmit={submit}>
      <input name="address" placeholder="0xA0Cf…251e" required />
      <input name="value" placeholder="0.05" required />
      <button 
        disabled={isPending}
        type="submit"
      >
        Send
        {isPending ? 'Confirming...' : 'Send'}
      </button>
      {hash && <div>Transaction Hash: {hash}</div>} 
    </form>
    </>
  )
}

export default App
