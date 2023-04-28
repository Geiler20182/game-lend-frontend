import React, { useState, useEffect } from "react";
import CustomerCard from "./customer-card";
import NewCustomer from "./new-customer";
export const apiUrl = process.env.API_BASE_URL;

export default function CustomerList() {
    const [customers, setCustomers] = useState([]);
    const [showCreateCustomerModal, setShowCreateCustomerModal] = useState(false);

    useEffect(() => {
        async function fetchCustomers() {
            const response = await fetch(`${apiUrl}/api/customers`);
            const data = await response.json();
            console.log(data);
            setCustomers(data);
        }
        fetchCustomers();
    }, []);

    return (
        <div className="container">
            <div className="d-flex justify-content-end py-3">
                <NewCustomer show={showCreateCustomerModal} handleClose={() => setShowCreateCustomerModal(false)} />
                <button type="button" className="btn btn-outline-primary" onClick={() => setShowCreateCustomerModal(true)}>Agregar nuevo cliente</button>
            </div>
            <div className="row">
                {customers.map((customer) => (
                    <div key={customer.customerId} className="col-md-4 col-sm-6 col-xl-3 mt-1">
                        <CustomerCard 
                            customerId={customer.customerId} 
                            name={customer.name}
                            email={customer.email}
                            age={customer.age}
                            address={customer.address}
                            phone={customer.phone}
                            
                            />
                    </div>
                ))}
            </div>
        </div>
    );
}
