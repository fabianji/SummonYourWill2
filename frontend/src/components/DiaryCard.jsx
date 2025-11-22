const DiaryCard = ({ entry }) => {
  return (
    <div className="card">
      <div className="card-content">
        <p className="muted small">{new Date(entry.created_at).toLocaleString()}</p>
        <h3>{entry.title}</h3>
        <p className="muted">Type: {entry.entry_type}</p>
        {entry.guide_ids?.length > 0 && (
          <div className="tag-row">
            {entry.guide_ids.map((id) => (
              <span key={id} className="chip">
                Guide {id}
              </span>
            ))}
          </div>
        )}
        <p>{entry.content}</p>
      </div>
    </div>
  );
};

export default DiaryCard;
