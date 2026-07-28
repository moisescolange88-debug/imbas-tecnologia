'use client'

interface SummaryBarProps {
  bruto: string
  descontos: string
  liquido: string
}

export default function SummaryBar({ bruto, descontos, liquido }: SummaryBarProps) {
  return (
    <div className="summary-bar">
      <div className="summary-item">
        <span className="summary-label">Bruto</span>
        <span className="summary-value">{bruto}</span>
      </div>
      <div className="summary-item summary-item--negative">
        <span className="summary-label">Descontos</span>
        <span className="summary-value">{descontos}</span>
      </div>
      <div className="summary-item summary-item--total">
        <span className="summary-label">Líquido</span>
        <span className="summary-value summary-value--gold">{liquido}</span>
      </div>
    </div>
  )
}
