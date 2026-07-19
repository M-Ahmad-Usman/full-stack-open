
import { useState } from 'react'

export default function useField (label) {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue('')
  }

  return {
    label,
    value,
    reset,
    onChange,
  }
}

export const getInputFields = useFieldHook => { 
    return { 
      label: useFieldHook.label,
      value: useFieldHook.value,
      onChange: useFieldHook.onChange 
    } 
}
