import { Button } from '@/components/ui/button'
import './App.css'
import { toast } from 'sonner'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

function App() {
  return (
    <div className='bg-gray-400'>
      <h1 className='text-red-500'>Get started</h1>
      <Button
        onClick={() => {
          toast.success('This is a success message!')
        }}
      >
        Button
      </Button>
      <Tooltip>
        <TooltipTrigger className='p-3 text-red-500'>Hover me</TooltipTrigger>
        <TooltipContent side='right' align='center'>
          <p className='p-3 text-white '>wasssup homie</p>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

export default App
