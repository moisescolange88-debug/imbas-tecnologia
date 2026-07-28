'use client'

import { ReactNode } from 'react'

interface ResultBoxProps {
  label: string
  value: string
  highlight?: boolean
  negative?: boolean
  children?: ReactNode
}

export default function ResultBox({ label, value, highlight, negative, children }: ResultBoxProps) {
  return (
    <div className={`result-box${highlight ? ' result-box--highlight' : ''}${negative ? ' result-box--negative' : ''}`}>
      <span className="result-box-label">{label}</span>
      <span className={`result-box-value${highlight ? ' result-box-value--gold' : ''}${negative ? ' result-box-value--negative' : ''}`}>
        {value}
      </span>
      {children}
    </div>
  )
}
