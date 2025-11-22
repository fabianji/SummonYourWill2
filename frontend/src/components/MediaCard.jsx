// Tarjeta para mostrar información breve de un elemento de media.
import PropTypes from "prop-types";

const MediaCard = ({ item }) => {
  // Expone tipo, título, descripción opcional, URL y etiquetas.
  return (
    <div className="card">
      <div className="card-content">
        <p className="muted small">{item.media_type.toUpperCase()}</p>
        <h3>{item.title}</h3>
        {item.description && <p>{item.description}</p>}
        <p className="muted">{item.url}</p>
        {item.tags?.length > 0 && (
          <div className="tag-row">
            {item.tags.map((tag) => (
              <span key={tag} className="chip">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

MediaCard.propTypes = {
  item: PropTypes.shape({
    media_type: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    url: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default MediaCard;
