'use client'

interface ResultsTableProps {
  items: { nome: string; valor: string; descricao?: string }[]
}

export default function ResultsTable({ items }: ResultsTableProps) {
  return (
    <div className="results-table-wrap">
      <table className="results-table">
        <thead>
          <tr>
            <th>Verba</th>
            <th className="th-valor">Valor</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i}>
              <td>
                {item.nome}
                {item.descricao && <div className="results-desc">{item.descricao}</div>}
              </td>
              <td className="td-valor">{item.valor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
