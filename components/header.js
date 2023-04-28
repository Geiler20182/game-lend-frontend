import Link from "next/link";
import { useState } from "react";

export default function Header({selected = 0}) {


    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid justify-content-center">
                <Link href="/" className="navbar-brand">
                    <i className="bi bi-bootstrap"></i>
                </Link>
                <div className="navbar-collapse justify-content-center  fs-5" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link href="/" className={`nav-link ${selected === 0 ? 'text-primary' : ''}`} >
                                Resumen
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/games" className={`nav-link ${selected === 1 ? 'text-primary' : ''}`} >
                                Juegos
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/customers" className={`nav-link ${selected === 2 ? 'text-primary' : ''}`}>
                                Clientes
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/rentals" className={`nav-link ${selected === 3 ? 'text-primary' : ''}`}>
                                Rentas
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
