import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { API_URL } from "../../db/api";
import { usePostContext } from "../../context/PostContext";

const Post = ({ showModal, handleClose }) => {
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const { addPost, setPosts } = usePostContext();

  useEffect(() => {
    if (showError) {
      const errorTimeout = setTimeout(() => {
        setShowError(false);
        setError("");
      }, 3000);

      return () => clearTimeout(errorTimeout);
    }
  }, [showError]);

  const handlePost = async () => {
    if (!author || !category || !editorState.getCurrentContent().hasText()) {
      setError("Todos os campos são obrigatórios");
      setShowError(true);
      return;
    }

    const contentState = editorState.getCurrentContent();
    const rawContentState = convertToRaw(contentState);

    // Extrair apenas o texto do conteúdo
    const textContent = rawContentState.blocks
      .map((block) => block.text)
      .join("\n");

    const formData = new FormData();
    formData.append("author", author);
    formData.append("category", category);
    formData.append("content", textContent);
    formData.append("image", image);

    try {
      // Enviar dados formatados para o backend
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const response = await API_URL.post("/api/post", formData, config);
      // Adicionar a nova postagem ao contexto
      addPost(response.data);
      // Fechar a modal
      handleClose();
    } catch (error) {
      console.error("Erro ao criar postagem:", error);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await API_URL.get("/api/get");
        // Atualizar a lista de posts no contexto
        setPosts(response.data);
      } catch (error) {
        console.error("Erro ao buscar posts:", error);
      }
    };

    // Chamar a função fetchPosts ao montar o componente
    fetchPosts();

    // Atualizar a lista de posts a cada intervalo de tempo (por exemplo, a cada 5 segundos)
    const intervalId = setInterval(fetchPosts, 5000);

    // Limpar o intervalo ao desmontar o componente
    return () => clearInterval(intervalId);
  }, [setPosts]);

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Criar Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {showError && <p style={{ color: "red" }}>{error}</p>}
        <Form>
          <Form.Group controlId="author">
            <Form.Label>Autor do Post</Form.Label>
            <Form.Control
              type="text"
              placeholder="Digite seu nome"
              onChange={(e) => setAuthor(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="category">
            <Form.Label>Selecione a Categoria</Form.Label>
            <Form.Control
              as="select"
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Selecione...</option>
              <option value="Post">Post</option>
              <option value="Artigo">Artigo</option>
              <option value="Grupo">Grupo</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="content">
            <Form.Label>Escrever Publicação</Form.Label>
            <Editor
              editorState={editorState}
              onEditorStateChange={setEditorState}
              toolbar={{
                options: [
                  "inline",
                  "list",
                  "textAlign",
                  "link",
                  "embedded",
                  "remove",
                  "history",
                ],
                inline: { options: ["bold", "italic", "underline"] },
              }}
              toolbarCustomButtons={[<ImageUploader setImage={setImage} />]}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Fechar
        </Button>
        <Button variant="primary" onClick={handlePost}>
          Publicar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const ImageUploader = ({ setImage }) => {
  const onImageUpload = (e) => {
    const selectedFile = e.target.files[0];
    console.log(selectedFile);
    setImage(selectedFile);
  };

  return (
    <div>
      <label>
        <input type="file" accept="image/*" onChange={onImageUpload} />
      </label>
    </div>
  );
};

export default Post;
