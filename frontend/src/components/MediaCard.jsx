const MediaCard = ({ item }) => {
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

export default MediaCard;
