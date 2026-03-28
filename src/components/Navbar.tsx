import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <header className="container">
            <nav>
                <Link className="nav-link" to="/"> VIN Decoder</Link>
                <Link className="nav-link" to="/variables">Variables</Link>
            </nav>
        </header>
    )
}