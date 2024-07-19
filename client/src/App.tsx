import { useState } from 'react'
import { Textarea } from './components/ui/textarea'
import { Button } from './components/ui/button'

function App() {
  const [code, setCode] = useState("")
  const [isCodeValid, setCodeValid] = useState(false)
  const [requirements, setRequirements] = useState("")

  const handleSetCode = async () => {
    try {
      const response = await fetch("/api/generate-requirements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ code })
      })

      if (response.ok) {
        const result = await response.json()
        setCodeValid(true)
        setRequirements(result.requirements)
      } else {
        console.log("Failed to fetch server response.")
      }
    } catch (error) {
      console.error("Error: ", error)
    }
  }

  return (
    <div className='relative min-h-screen items-center justify-center flex flex-col'>
      <div className='gap-y-7 w-64 md:w-72 lg:w-96'>
        <Textarea 
          id="code"
          placeholder="Enter your code here..."
          onChange={(e) => setCode(e.target.value)}
          rows={10}
          className='w-full h-full flex flex-1 text-black'
          required
        />
      </div>
      <Button variant={'outline'} onClick={handleSetCode} className='w-24 mt-4 rounded-lg'>Test</Button>
      <br />
      <h1>{isCodeValid ? requirements : "Please enter valid code."}</h1>
    </div>
  )
}

export default App
