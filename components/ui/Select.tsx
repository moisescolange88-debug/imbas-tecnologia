'use client'

import { SelectHTMLAttributes, forwardRef } from 'react'
import clsx from 'clsx'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: SelectOption[]
  error?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, className, id, ...props }, ref) => {
    const selectId = id || `select-${label.toLowerCase().replace(/\s+/g, '-')}`
    return (
      <div className={clsx('calc-field', className)}>
        <label htmlFor={selectId} className="calc-label">{label}</label>
        <div className="calc-input-wrap">
          <select
            ref={ref}
            id={selectId}
            className={clsx('calc-input calc-select', { 'calc-input--error': error })}
            {...props}
          >
            {options.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        {error && <span className="calc-error">{error}</span>}
      </div>
    )
  }
)
Select.displayName = 'Select'
export default Select
