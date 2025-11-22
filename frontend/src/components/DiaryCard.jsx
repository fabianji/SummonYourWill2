// Tarjeta compacta para mostrar una entrada de diario.
import PropTypes from "prop-types";

const DiaryCard = ({ entry }) => {
  // Presenta fecha, título, tipo, guías relacionados y contenido breve.
  return (
    <div className="card">
      <div className="card-content">
        <p className="muted small">{new Date(entry.created_at).toLocaleDateString()}</p>
        <h3>{entry.title}</h3>
        <p className="muted small">Type: {entry.entry_type}</p>
        {entry.guide_ids?.length > 0 && (
          <div className="tag-row">
            {entry.guide_ids.map((guideId) => (
              <span key={guideId} className="chip">
                Guide {guideId}
              </span>
            ))}
          </div>
        )}
        <p>{entry.content}</p>
      </div>
    </div>
  );
};

DiaryCard.propTypes = {
  entry: PropTypes.shape({
    title: PropTypes.string,
    created_at: PropTypes.string,
    entry_type: PropTypes.string,
    guide_ids: PropTypes.arrayOf(PropTypes.string),
    content: PropTypes.string,
  }).isRequired,
};

export default DiaryCard;
