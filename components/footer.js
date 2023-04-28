import Link from "next/link"
export default function Footer() {
    return (

        <footer className="text-center text-lg-start bg-white text-muted mt-4" >
            <div className="text-center p-4 bg-light">
                © 2023 Copyright:
                <Link className="text-reset fw-bold" href="/">Game Lend</Link>
            </div>
        </footer>

    )
}