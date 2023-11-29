import React, { useContext, useState } from "react";
import { Card, Button, Dropdown, Modal } from "react-bootstrap";
import { PostContext } from "../../context/PostContext";

const Feed = () => {
  const { posts, deletePost, editPost } = useContext(PostContext);
  const [expandedPosts, setExpandedPosts] = useState([]);

  const handleExpandPost = (postId) => {
    setExpandedPosts((prevExpanded) => [...prevExpanded, postId]);
  };

  const handleDeletePost = (postId) => {
    const confirmDelete = window.confirm("Deseja realmente deletar este post?");
    if (confirmDelete) {
      deletePost(postId);
    }
  };

  const handleEditPost = (postId, content) => {
    const editedContent = prompt("Edite o conteúdo do post:", content);
    if (editedContent !== null) {
      editPost(postId, editedContent);
    }
  };

  return (
    <div>
      {posts.map((post) => (
        <Card key={post.id} className="mb-3">
          <Card.Header>
            <img src="avatar_default.jpg" alt="Avatar" className="avatar" />
            {post.author}
          </Card.Header>
          <Card.Body>
            <Card.Text>
              {expandedPosts.includes(post.id)
                ? post.content
                : post.content.length > 500
                ? `${post.content.slice(0, 500)}...`
                : post.content}
            </Card.Text>
            {post.content.length > 500 && !expandedPosts.includes(post.id) && (
              <Button variant="link" onClick={() => handleExpandPost(post.id)}>
                Leia mais...
              </Button>
            )}
          </Card.Body>
          {post.images.length > 0 && !expandedPosts.includes(post.id) && (
            <Card.Img variant="bottom" src={post.images[0]} />
          )}
          <Card.Footer>
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Opções
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleEditPost(post.id, post.content)}>
                  Editar
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleDeletePost(post.id)}>
                  Deletar
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Card.Footer>
        </Card>
      ))}
    </div>
  );
};

export default Feed;
