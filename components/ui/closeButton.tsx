
import React from 'react'
import { X } from 'lucide-react'

type CloseButtonProps = {
  onClick: () => void;
  size?: number;
  className?: string;
}

const CloseButton = ({ onClick, size = 20, className }: CloseButtonProps) => {
  return (
    <button onClick={onClick} className={className}>
      <X size={size} />
    </button>
  )
}

export default CloseButton