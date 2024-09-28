import { useNavigate } from "react-router-dom";

export default function Goback() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(-1);
    };

    return (
        <button
            onClick={handleClick}
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded shadow hover:bg-blue-600 transition duration-200"
        >
            Trở lại
        </button>
    );
}
