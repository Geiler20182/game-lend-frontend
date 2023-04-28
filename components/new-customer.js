import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Input } from "reactstrap";

export const apiUrl = process.env.API_BASE_URL;

export default function NewCustomer({ show, handleClose }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [age, setAge] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    const handleCreateCustomer = () => {
        if (validateFields()) {
            fetch(`${apiUrl}/api/customers`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    address: address,
                    phone: phone,
                    age: age,
                }),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Error al crear el cliente");
                    }
                    setName("");
                    setEmail("");
                    setAddress("");
                    setPhone("");
                    setAge("");
                    setShowSuccessAlert(true); // Mostrar la alerta de éxito después de crear el cliente
                    setTimeout(() => {
                        setShowSuccessAlert(false); // Ocultar la alerta después de 2 segundos
                    }, 2500);
                    handleClose(); // Cerrar el modal después de crear el cliente
                    location.reload();
                })
                .catch((error) => {
                    console.error("Error:", error);
                    setErrorMessage("Error al crear el cliente");
                    setShowModal(true);
                });
        }
    };

    const validateFields = () => {
        if (!name || !email || !address || !phone || !age) {
            setShowModal(true);
            setErrorMessage("Por favor, completa todos los campos.");
            return false;
        }

        if (!/^\S+@\S+\.\S+$/.test(email)) {
            setShowModal(true);
            setErrorMessage("Ingresa un correo electrónico válido.");
            return false;
        }

        if (!/^\d+$/.test(age)) {
            setShowModal(true);
            setErrorMessage("Ingresa una edad válida.");
            return false;
        }

        if (phone.length < 0) {
            setShowModal(true);
            setErrorMessage("Ingresa un número de teléfono válido.");
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
                    El cliente ha sido creado exitosamente!
                </div>
            )}

            <Modal isOpen={show} toggle={handleClose}>
                <ModalHeader toggle={handleClose}>Crear cliente</ModalHeader>
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
                                type="text"
                                id="email"
                                placeholder="Correo electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mx-2"
                            />
                        </FormGroup>
                        <FormGroup className="d-flex">
                            <Input
                                type="text"
                                id="address"
                                placeholder="Dirección"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="mx-2"
                            />
                            <Input
                                type="text"
                                id="phone"
                                placeholder="Teléfono"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="mx-2"
                            />
                        </FormGroup>
                        <FormGroup className="d-flex">
                            <Input
                                type="number"
                                id="age"
                                placeholder="Edad"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                className="mx-2"
                            />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={handleClose}>
                            Cerrar
                        </Button>
                        <Button color="primary" onClick={handleCreateCustomer}>
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
