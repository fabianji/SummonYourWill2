import './Card.css'

function Card({ title, subtitle, children, action }) {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3>{title}</h3>
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>
        {action && <div className="card-action">{action}</div>}
      </div>
      <div className="card-body">{children}</div>
    </div>
  )
}

export default Card
