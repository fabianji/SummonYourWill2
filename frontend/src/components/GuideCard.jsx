// Tarjeta para mostrar datos básicos de una guía espiritual.
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const GuideCard = ({ guide }) => {
  // Incluye imagen opcional, nombre, descripción y etiquetas de dominios.
  return (
    <div className="card">
      {guide.main_image_url && (
        <img className="card-image" src={guide.main_image_url} alt={guide.name} />
      )}
      <div className="card-content">
        <h3>{guide.name}</h3>
        {guide.description && <p className="muted">{guide.description}</p>}
        {guide.domains?.length > 0 && (
          <div className="tag-row">
            {guide.domains.map((domain) => (
              <span key={domain} className="chip">
                {domain}
              </span>
            ))}
          </div>
        )}
        <Link to={`/guides/${guide.id}`} className="button secondary">
          View guide
        </Link>
      </div>
    </div>
  );
};

GuideCard.propTypes = {
  guide: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    main_image_url: PropTypes.string,
    domains: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default GuideCard;
