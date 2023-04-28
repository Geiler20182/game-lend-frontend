import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

export const apiUrl = process.env.API_BASE_URL;


export default function CustomerCard({ customerId, name, email, address, phone, age }) {
    const [editing, setEditing] = useState(false);
    const [editedName, setEditedName] = useState(name);
    const [editedEmail, setEditedEmail] = useState(email);
    const [editedAddress, setEditedAddress] = useState(address);
    const [editedPhone, setEditedPhone] = useState(phone);
    const [editedAge, setEditedAge] = useState(age);

    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleOpenModal = (message) => {
        setErrorMessage(message);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const toggleEditing = () => {
        setEditing(!editing);
    };

    const validateAndToggleEditing = () => {
        if (validateFields()) {
            toggleEditing();
        }
    };

    const validateFields = () => {
        if (!editedName || !editedEmail || !editedAddress || !editedPhone || !editedAge) {
            handleOpenModal("Todos los campos son obligatorios.");
            return false;
        }

        if (!/^\S+@\S+\.\S+$/.test(editedEmail)) {
            handleOpenModal("Ingresa un correo electrónico válido.");
            return false;
        }

        if (!/^\d+$/.test(editedAge)) {
            handleOpenModal("Ingresa una edad válida.");
            return false;
        }

        if (editedPhone.length < 0) {
            handleOpenModal("Ingresa un número de teléfono válido.");
            return false;
        }

        return true;
    };
    const handleDeleteCustomer = () => {
        fetch(`${apiUrl}/api/customers/${customerId}`, {
            method: "DELETE",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error al eliminar el cliente");
                }
                return response.json();
            })
            .then((data) => {
                setShowDeleteModal(false);
                location.reload();
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    const handleSaveChanges = () => {
        if (validateFields()) {
            const customer = {
                customerId: customerId,
                name: editedName,
                email: editedEmail,
                address: editedAddress,
                phone: editedPhone,
                age: parseInt(editedAge),
            };
            fetch(`${apiUrl}/api/customers/${customerId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(customer),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Error al guardar los cambios");
                    }
                    return response.json();
                })
                .then((data) => {
                    toggleEditing();
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        }
    };

    const randomProfileImage = `/banner${Math.floor(Math.random() * 4) + 1}.jpg`;

    return (
        <>
            <div className="card mb-4 h-100">
                <div className="card-header d-flex justify-content-between align-items-center text-center">
                    <h5 className="card-title mb-0">
                        {editing ? (
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                            />
                        ) : (
                            editedName
                        )}
                    </h5>
                    <div className="btn-group">
                        <button className="btn btn-outline-primary btn-sm" onClick={toggleEditing}>
                            <i className={editing ? "bi bi-save" : "bi bi-pencil"}></i>
                        </button>
                        <button className="btn btn-outline-danger btn-sm" onClick={() => setShowDeleteModal(true)}>
                            <i className="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
                <img
                    src={randomProfileImage}
                    className="card-img-top"
                    alt={name}
                    style={{ maxHeight: "80px", objectFit: "cover" }}
                />
                <div className="card-body">
                    <p className="card-text mb-0">
                        Email:{" "}
                        {editing ? (
                            <input
                                type="email"
                                className="form-control form-control-sm"
                                value={editedEmail}
                                onChange={(e) => setEditedEmail(e.target.value)}
                            />
                        ) : (
                            editedEmail
                        )}
                    </p>
                    <p className="card-text mb-0">
                        Nombre:{" "}
                        {editing ? (
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                            />
                        ) : (
                            editedName
                        )}
                    </p>
                    <p className="card-text mb-0">
                        Edad:{" "}
                        {editing ? (
                            <input
                                type="number"
                                className="form-control form-control-sm"
                                value={editedAge}
                                onChange={(e) => setEditedAge(e.target.value)}
                            />
                        ) : (
                            editedAge
                        )}
                    </p>
                    <p className="card-text mb-0">
                        Dirección:{" "}
                        {editing ? (
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                value={editedAddress}
                                onChange={(e) => setEditedAddress(e.target.value)}
                            />
                        ) : (
                            editedAddress
                        )}
                    </p>
                    <p className="card-text mb-0">
                        Teléfono:{" "}
                        {editing ? (
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                value={editedPhone}
                                onChange={(e) => setEditedPhone(e.target.value)}
                            />
                        ) : (
                            editedPhone
                        )}
                    </p>
                </div>
                <div className="card-footer text-center">
                    <button className="btn btn-primary btn-sm" disabled={editing} onClick={toggleEditing}>
                        Editar
                    </button>
                    {editing && (
                        <button className="btn btn-primary btn-sm ms-2" onClick={handleSaveChanges}>
                            Guardar
                        </button>
                    )}
                </div>
            </div>
            <Modal isOpen={showModal} toggle={handleCloseModal}>
                <ModalHeader toggle={handleCloseModal}>Error en la validación</ModalHeader>
                <ModalBody>{errorMessage}</ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={handleCloseModal}>
                        Cerrar
                    </Button>
                </ModalFooter>
            </Modal>
            <Modal isOpen={showDeleteModal} toggle={() => setShowDeleteModal(false)}>
                <ModalHeader toggle={() => setShowDeleteModal(false)}>Confirmar eliminación</ModalHeader>
                <ModalBody>¿Estás seguro de que deseas eliminar el cliente {name}?</ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={handleDeleteCustomer}>
                        Eliminar
                    </Button>{" "}
                    <Button color="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancelar
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
}
