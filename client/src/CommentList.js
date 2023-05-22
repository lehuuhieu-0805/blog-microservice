import { useEffect, useState } from 'react';
import axios from 'axios';

function CommentList({ postId }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    axios({
      method: 'GET',
      url: `http://localhost:4001/posts/${postId}/comments`,
    })
      .then((res) => {
        setComments(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [postId]);

  const renderedComments = comments.map((comment) => {
    return <li key={comment.id}>{comment.content}</li>;
  });

  return <ul>{renderedComments}</ul>;
}

export default CommentList;
