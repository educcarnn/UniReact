// EditPostForm.jsx
import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const EditPostForm = ({ show, onHide, onSave, post }) => {
  const [editedPost, setEditedPost] = useState(post);

  useEffect(() => {
    // Atualize o estado interno quando o post for alterado
    setEditedPost(post);
  }, [post]);

  const handleSave = () => {
    onSave(editedPost);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="editTitle">
            <Form.Label>Título</Form.Label>
            <Form.Control
              type="text"
              value={editedPost?.author}
              onChange={(e) =>
                setEditedPost((prev) => ({ ...prev, author: e.target.value }))
              }
            />
          </Form.Group>
          <Form.Group controlId="editCategory">
            <Form.Label>Categoria</Form.Label>
            <Form.Control
              as="select"
              value={editedPost?.category}
              onChange={(e) =>
                setEditedPost((prev) => ({ ...prev, category: e.target.value }))
              }
            >
              <option value="Post">Post</option>
              <option value="Artigo">Artigo</option>
              <option value="Grupo">Grupo</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="editContent">
            <Form.Label>Conteúdo</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={editedPost?.content}
              onChange={(e) =>
                setEditedPost((prev) => ({ ...prev, content: e.target.value }))
              }
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Fechar
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Salvar Edições
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditPostForm;
