import React, { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
export const apiUrl = process.env.API_BASE_URL;

export default function GameCard({ id, name, imageUrl, platform, director, producer, year, price, available }) {
    const [editing, setEditing] = useState(false);
    const [editedName, setEditedName] = useState(name);
    const [editedPlatform, setEditedPlatform] = useState(platform);
    const [editedDirector, setEditedDirector] = useState(director);
    const [editedProducer, setEditedProducer] = useState(producer);
    const [editedYear, setEditedYear] = useState(year);
    const [editedPrice, setEditedPrice] = useState(price);
    const [customerList, setCustomerList] = useState([]);
    const [showRentModal, setShowRentModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [rentalData, setRentalData] = useState({
        startDate: "",
        endDate: "",
        title: name,
        price: price,
        customer: null,
    });

    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

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
            if (editing == true) {
                updateGame();
                location.reload();
            }
            toggleEditing();
        }
    };

    const handleDeleteGame = () => {
        fetch(`${apiUrl}/api/games/${id}`, {
            method: "DELETE",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error al eliminar el juego");
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

    const updateGame = async () => {
        const updatedGame = {
            name: editedName,
            year: editedYear,
            director: editedDirector,
            producer: editedProducer,
            platform: editedPlatform,
            price: editedPrice,
            urlImage: imageUrl,
            gameStatus: available ? "AVAILABLE" : "RENTED",
        };

        try {
            const response = await fetch(`${apiUrl}/api/games/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedGame),
            });

            if (!response.ok) {
                throw new Error("Error al actualizar el juego");
            }

            toggleEditing();
        } catch (error) {
            console.error(error);
        }
    };

    const validateFields = () => {
        if (!editedName || !editedPlatform || !editedDirector || !editedProducer || !editedYear || !editedPrice) {
            handleOpenModal("Todos los campos son obligatorios.");
            return false;
        }

        if (parseFloat(editedPrice) < 0.1) {
            handleOpenModal("El precio debe ser mayor o igual a 0.1.");
            return false;
        }

        return true;
    };

    const fetchCustomers = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/customers`);
            const data = await response.json();
            setCustomerList(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleCustomerSelect = (event) => {
        const customer = customerList.find((c) => c.email === event.target.value);
        setRentalData((prevData) => ({ ...prevData, customer: customer }));
    };

    const handleRental = () => {
        if (
            !rentalData.startDate ||
            !rentalData.endDate ||
            !rentalData.title ||
            !rentalData.price ||
            !rentalData.customer
        ) {
            handleOpenModal("Todos los campos son obligatorios.");
            return;
        }

        if (rentalData.price < 0.1) {
            handleOpenModal("El precio de la renta debe ser mayor o igual a 0.1.");
            return;
        }

        const rental = {
            rentalDate: rentalData.startDate,
            limitDate: rentalData.endDate,
            rentalPrice: rentalData.price,
            customerId: rentalData.customer.customerId,
            gameId: id,
        };
        fetch(`${apiUrl}/api/rentals`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(rental),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error al realizar la renta");
                }
                return response.json();
            })
            .then((data) => {
                console.log(data);
                setShowRentModal(false);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
        location.reload();
    };

    return (
        <>
            <div className="card mb-4 h-100">
                <div className="card-header d-flex justify-content-between align-items-center text-center">
                    <h5 className="card-title mb-0 d-flex align-items-center">
                        {editing ? (
                            <input
                                type="text"
                                className="form-control form-control-sm ms-5 mb-2"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                            />
                        ) : (
                            editedName
                        )}
                    </h5>
                    <div className="btn-group">
                        <button className="btn btn-outline-primary btn-sm" onClick={validateAndToggleEditing}>
                            <i className={editing ? "bi bi-save" : "bi bi-pencil"}></i>
                        </button>
                        {available && (
                            <button className="btn btn-outline-danger btn-sm" onClick={() => setShowDeleteModal(true)}>
                                <i className="bi bi-trash"></i>
                            </button>
                        )}
                    </div>
                </div>
                <img
                    src={imageUrl}
                    className="card-img-top"
                    alt={name}
                    style={{ maxHeight: "250px", objectFit: "cover" }}
                />

                <div className="card-body">
                    <p className="card-text mb-0 d-flex align-items-center">
                        <strong>Plataforma:</strong>{" "}
                        {editing ? (
                            <input
                                type="text"
                                className="form-control form-control-sm ms-2 mb-2"
                                value={editedPlatform}
                                onChange={(e) => setEditedPlatform(e.target.value)}
                            />
                        ) : (
                            editedPlatform
                        )}
                    </p>
                    <p className="card-text mb-0 d-flex align-items-center">
                        <strong>Director: </strong>{" "}
                        {editing ? (
                            <input
                                type="text"
                                className="form-control form-control-sm ms-2 mb-2"
                                value={editedDirector}
                                onChange={(e) => setEditedDirector(e.target.value)}
                            />
                        ) : (
                            editedDirector
                        )}
                    </p>
                    <p className="card-text mb-0 d-flex align-items-center">
                        <strong>Productor: </strong>
                        {editing ? (
                            <input
                                type="text"
                                className="form-control form-control-sm ms-2 mb-2"
                                value={editedProducer}
                                onChange={(e) => setEditedProducer(e.target.value)}
                            />
                        ) : (
                            editedProducer
                        )}
                    </p>
                    <p className="card-text mb-0 d-flex align-items-center">
                        <strong>Año:</strong>{" "}
                        {editing ? (
                            <input
                                type="text"
                                className="form-control form-control-sm ms-2 mb-2"
                                value={editedYear}
                                onChange={(e) => setEditedYear(e.target.value)}
                            />
                        ) : (
                            editedYear
                        )}
                    </p>
                    <p className="card-text mb-0 d-flex align-items-center">
                        <strong>Precio:</strong>{" "}
                        {editing ? (
                            <input
                                type="text"
                                className="form-control form-control-sm ms-2 mb-2"
                                value={editedPrice}
                                onChange={(e) => setEditedPrice(e.target.value)}
                            />
                        ) : (
                            <span className="text-info ">${editedPrice}</span>
                        )}
                    </p>
                    <p className="card-text">
                        <strong>Estado:</strong>{" "}
                        <span className={available ? "text-success" : "text-danger"}>
                            {available ? "Disponible" : "Juego rentado"}
                        </span>
                    </p>
                </div>
                <div className="card-footer text-center">
                    <button
                        className="btn btn-primary btn-sm"
                        disabled={editing || !available}
                        onClick={() => setShowRentModal(true)}>
                        Rentar Juego
                    </button>
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
            <Modal isOpen={showRentModal} toggle={() => setShowRentModal(false)}>
                <ModalHeader toggle={() => setShowRentModal(false)}>Rentar Juego</ModalHeader>
                <ModalBody>
                    <div className="mb-3">
                        <label htmlFor="start-date" className="form-label">
                            Fecha de inicio
                        </label>
                        <input
                            type="date"
                            className="form-control"
                            id="start-date"
                            value={rentalData.startDate}
                            onChange={(e) => setRentalData((prevData) => ({ ...prevData, startDate: e.target.value }))}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="end-date" className="form-label">
                            Fecha de finalización
                        </label>
                        <input
                            type="date"
                            className="form-control"
                            id="end-date"
                            value={rentalData.endDate}
                            onChange={(e) => setRentalData((prevData) => ({ ...prevData, endDate: e.target.value }))}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">
                            Título del juego
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="title"
                            value={rentalData.title}
                            disabled={true}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="price" className="form-label">
                            Precio de la renta
                        </label>
                        <div className="input-group">
                            <span className="input-group-text">$</span>
                            <input
                                type="number"
                                className="form-control"
                                id="price"
                                value={rentalData.price}
                                onChange={(e) =>
                                    setRentalData((prevData) => ({ ...prevData, price: parseFloat(e.target.value) }))
                                }
                            />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="customer" className="form-label">
                            Cliente
                        </label>
                        <select
                            className="form-select"
                            id="customer"
                            value={rentalData.customer ? rentalData.customer.email : ""}
                            onChange={handleCustomerSelect}>
                            <option value="">Selecciona un cliente</option>
                            {customerList.map((customer) => (
                                <option key={customer.customerId} value={customer.email}>
                                    {customer.name} ({customer.email})
                                </option>
                            ))}
                        </select>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <button className="btn btn-primary" onClick={handleRental}>
                        Rentar
                    </button>
                    <button className="btn btn-secondary" onClick={() => setShowRentModal(false)}>
                        Cancelar
                    </button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={showDeleteModal} toggle={() => setShowDeleteModal(false)}>
                <ModalHeader toggle={() => setShowDeleteModal(false)}>Confirmar eliminación</ModalHeader>
                <ModalBody>¿Estás seguro de que deseas eliminar el juego {name}?</ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={handleDeleteGame}>
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
