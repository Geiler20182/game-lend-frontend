import React, { useState, useEffect } from "react";
import RentalCard from "./rental-card";
export const apiUrl = process.env.API_BASE_URL;

export default function RentalList() {
    const [rentals, setRentals] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    const loadRentals = () => {
        fetch(`${apiUrl}/api/rentals`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error al obtener las rentas");
                }
                return response.json();
            })
            .then((data) => {
                setRentals(data);
            })
            .catch((error) => {
                console.error("Error:", error);
                setErrorMessage("Error al obtener las rentas");
            });
    };

    useEffect(() => {
        loadRentals();
    }, []);

    const handleReceive = (rentalId) => {
        // Realizar la acción necesaria para recibir la renta
        console.log(`Recibiendo renta ${rentalId}`);
        // Actualizar la lista de rentas
        setRentals(rentals.filter((rental) => rental.rentalId !== rentalId));
    };

    return (
        <>
            <div className="container">
                <div className="row">
                    {rentals.length > 0 ? (
                        rentals.map((rental, index) => (
                            <div className="col-md-4 col-sm-6 col-xl-3 mt-1" key={index}>
                                <RentalCard
                                    key={rental.rentalId}
                                    rentalId={rental.rentalId}
                                    customerId={rental.customerId}
                                    gameId={rental.gameId}
                                    rentalDate={rental.rentalDate}
                                    limitDate={rental.limitDate}
                                    returnDate={rental.returnDate} 
                                    price={rental.rentalPrice}
                                    onReceive={() => handleReceive(rental.rentalId)}
                                />
                            </div>
                        ))
                    ) : (
                        <p>No hay rentas disponibles.</p>
                    )}
                    {errorMessage && <p>{errorMessage}</p>}
                </div>
            </div>
        </>
    );
}
