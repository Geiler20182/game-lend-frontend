import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Input } from "reactstrap";
export const apiUrl = process.env.API_BASE_URL;

export default function NewGame({ show, handleClose }) {

    const [name, setName] = useState("");
    const [platform, setPlatform] = useState("");
    const [director, setDirector] = useState("");
    const [producer, setProducer] = useState("");
    const [year, setYear] = useState("");
    const [price, setPrice] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    const platformOptions = [
        { value: "XBOX", label: "XBOX" },
        { value: "Nintendo", label: "Nintendo" },
        { value: "Play_Station", label: "Play Station" },
        { value: "PC", label: "PC" },
    ];

    const handleCreateGame = () => {
        if (validateFields()) {
            fetch(`${apiUrl}/api/games`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name,
                    platform: platform,
                    director: director,
                    producer: producer,
                    year: year,
                    price: price,
                    urlImage: imageUrl,
                    gameStatus: "AVAILABLE",
                }),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Error al crear el juego : ");
                    }
                    setName("");
                    setPlatform("");
                    setDirector("");
                    setProducer("");
                    setYear("");
                    setPrice("");
                    setImageUrl("");
                    setShowSuccessAlert(true); // Mostrar la alerta de éxito después de crear el juego
                    setTimeout(() => {
                        setShowSuccessAlert(false); // Ocultar la alerta después de 2 segundos
                    }, 2500);
                    handleClose(); // Cerrar el modal después de crear el juego
                    location.reload();
                })
                .catch((error) => {
                    console.error("Error:", error);
                    setErrorMessage("Error al crear el juego");
                    setShowModal(true);
                });
        }
    };

    const handleImageUrlChange = (event) => {
        setImageUrl(event.target.value);
    };

    const validateFields = () => {
        if (!name || !platform || !director || !producer || !year || !price || !imageUrl) {
            setShowModal(true);
            setErrorMessage("Por favor, completa todos los campos.");
            return false;
        }
        return true;
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setErrorMessage("");
    };

    return (
        <>
            {showSuccessAlert && (
                <div
                    className="alert alert-success mt-3 position-fixed bottom-1 start-50 translate-middle-x"
                    style={{ zIndex: 9999 }}
                    role="alert">
                    El juego ha sido creado exitosamente!
                </div>
            )}

            <Modal isOpen={show} toggle={handleClose}>
                <ModalHeader toggle={handleClose}>Crear juego</ModalHeader>
                <Form onSubmit={(e) => e.preventDefault()}>
                    <ModalBody>
                        <FormGroup className="d-flex">
                            <Input
                                type="text"
                                id="name"
                                placeholder="Nombre"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mx-2"
                            />
                            <Input
                                type="number"
                                id="year"
                                placeholder="Año"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className="mx-2"
                            />
                        </FormGroup>
                        <FormGroup className="d-flex">
                            <Input
                                type="select"
                                value={platform}
                                onChange={(e) => setPlatform(e.target.value)}
                                className="mx-2">
                                <option value="">Seleccione una plataforma</option>
                                {platformOptions.map((option, index) => (
                                    <option key={index} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </Input>
                            <Input
                                type="text"
                                id="director"
                                placeholder="Director"
                                value={director}
                                onChange={(e) => setDirector(e.target.value)}
                                className="mx-2"
                            />
                        </FormGroup>
                        <FormGroup className="d-flex">
                            <Input
                                type="text"
                                id="producer"
                                placeholder="Productor"
                                value={producer}
                                onChange={(e) => setProducer(e.target.value)}
                                className="mx-2"
                            />
                            <Input
                                type="number"
                                id="price"
                                placeholder="Precio"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="mx-2"
                            />
                        </FormGroup>
                        <FormGroup className="text-center">
                            <Input
                                type="text"
                                id="imageUrl"
                                value={imageUrl}
                                onChange={handleImageUrlChange}
                                className="ms-2 me-3"
                            />
                            {imageUrl && (
                                <img
                                    src={imageUrl}
                                    alt="Previsualización de la imagen"
                                    className="mt-2 justify-content-center"
                                    style={{ maxWidth: "60%" }}
                                />
                            )}
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={handleClose}>
                            Cerrar
                        </Button>
                        <Button color="primary" onClick={handleCreateGame}>
                            Crear
                        </Button>
                    </ModalFooter>
                </Form>
            </Modal>

            <Modal isOpen={showModal} toggle={handleCloseModal}>
                <ModalHeader toggle={handleCloseModal}>Error en la validación</ModalHeader>
                <ModalBody>{errorMessage}</ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={handleCloseModal}>
                        Cerrar
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
}
