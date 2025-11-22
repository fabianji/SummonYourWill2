// Tarjeta presentacional para mostrar una habilidad desbloqueada.
import PropTypes from "prop-types";

const AbilityCard = ({ ability }) => {
  // Renderiza la fecha de desbloqueo, el nombre, la descripción y chips de imágenes asociadas.
  return (
    <div className="card">
      <div className="card-content">
        <p className="muted small">
          Unlocked: {new Date(ability.unlocked_at).toLocaleDateString()}
        </p>
        <h3>{ability.name}</h3>
        <p>{ability.description}</p>
        {ability.image_urls?.length > 0 && (
          <div className="tag-row">
            {ability.image_urls.map((img) => (
              <span key={img} className="chip">
                Image
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

AbilityCard.propTypes = {
  ability: PropTypes.shape({
    unlocked_at: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    image_urls: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default AbilityCard;
