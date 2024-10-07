import React, { useEffect, useState } from 'react';
import { Container, Form, Button, ListGroup, Alert } from 'react-bootstrap';

const App = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError('Error fetching users');
      }
    };

    fetchUsers();
  }, []);

  // Create a new post
  const createPost = async () => {
    if (!selectedUserId || !postTitle || !postBody) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: postTitle,
          body: postBody,
          userId: selectedUserId,
        }),
      });
      const newPost = await response.json();

      // Fetch comments for the newly created post
      const commentsResponse = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${newPost.id}`);
      const commentsData = await commentsResponse.json();
      setComments(commentsData);
    } catch (error) {
      setError('Error creating post or fetching comments');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">API Chaining Dashboard</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form>
        <Form.Group controlId="userSelect">
          <Form.Label>Select User</Form.Label>
          <Form.Control as="select" onChange={(e) => setSelectedUserId(e.target.value)} value={selectedUserId}>
            <option value="">Select a user...</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="postTitle">
          <Form.Label>Post Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter post title"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="postBody">
          <Form.Label>Post Body</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter post body"
            value={postBody}
            onChange={(e) => setPostBody(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" onClick={createPost} disabled={loading}>
          {loading ? 'Loading...' : 'Create Post'}
        </Button>
      </Form>

      {comments.length > 0 && (
        <div className="mt-4">
          <h2>Comments</h2>
          <ListGroup>
            {comments.map(comment => (
              <ListGroup.Item key={comment.id}>
                <strong>{comment.name}:</strong> {comment.body}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      )}
    </Container>
  );
};

export default App;
