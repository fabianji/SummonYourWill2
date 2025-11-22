import { Link } from "react-router-dom";

const GuideCard = ({ guide }) => {
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

export default GuideCard;
