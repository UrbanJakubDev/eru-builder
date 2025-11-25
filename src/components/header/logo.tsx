import Link from "next/link";
import { FaTools } from "react-icons/fa";

export default function Logo() {
    return (
        <Link href="/" className="flex items-center gap-3 font-bold text-xl hover:text-brand transition-colors group">
            <div className="p-2 rounded-lg bg-gray-800 group-hover:bg-brand/20 transition-colors">
                <FaTools className="text-brand" />
            </div>
            <span>CHP Tools</span>
        </Link>
    )
}