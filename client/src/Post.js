import { formatISO9075 } from 'date-fns';
import { Link } from 'react-router-dom';

export default function Post({
  _id,
  title,
  summary,
  cover,
  createdAt,
  author,
  currentUserId,
}) {

  return (
    <div className="post">
      <div className="image">
        <Link to={`/post/${_id}`}>
          <img src={`${process.env.REACT_APP_SERVER_URL}/` + cover} alt='post cover' />
        </Link>
      </div>
      <div className="texts">
        <Link to={`/post/${_id}`}>
          <h2>{title}</h2>
        </Link>
        <p className="info">
          <Link to={currentUserId === author._id ? '/account' : `/user/${author._id}`}>
            {author.username}
          </Link>
          <time>{formatISO9075(new Date(createdAt))}</time>
        </p>
        <p className="summary">{summary}</p>
      </div>
    </div>
  );
}

