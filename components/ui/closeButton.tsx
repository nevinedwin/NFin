
import React from 'react'
import { X } from 'lucide-react'

type CloseButtonProps = {
  onClick: () => void;
  size?: number;
}

const CloseButton = ({ onClick, size = 20 }: CloseButtonProps) => {
  return (
    <button onClick={onClick}>
      <X size={size} />
    </button>
  )
}

export default CloseButton