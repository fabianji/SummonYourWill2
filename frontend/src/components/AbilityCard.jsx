const AbilityCard = ({ ability }) => {
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

export default AbilityCard;
