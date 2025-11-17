import { Link } from "react-router-dom";

export default function BalcarInfo() {
    return (
        <>
        <div className="bg-gray-50 text-gray-800 font-sans">
            Pagina de Informações do BALCAR - Em construção.
        </div>
        <div>
            <Link to="/balcar" className="text-blue-600 hover:underline">
                Voltar ao Menu do BALCAR
            </Link>
        </div>
        </>
    );
}
