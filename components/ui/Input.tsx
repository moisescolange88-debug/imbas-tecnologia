'use client'

import { InputHTMLAttributes, forwardRef } from 'react'
import clsx from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  prefix?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, prefix, className, id, ...props }, ref) => {
    const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`
    return (
      <div className={clsx('calc-field', className)}>
        <label htmlFor={inputId} className="calc-label">{label}</label>
        <div className="calc-input-wrap">
          {prefix && <span className="calc-prefix">{prefix}</span>}
          <input
            ref={ref}
            id={inputId}
            className={clsx('calc-input', { 'calc-input--error': error, 'calc-input--prefix': !!prefix })}
            {...props}
          />
        </div>
        {error && <span className="calc-error">{error}</span>}
      </div>
    )
  }
)
Input.displayName = 'Input'
export default Input
