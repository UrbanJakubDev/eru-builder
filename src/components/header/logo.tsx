import Link from "next/link";
import { FaTools } from "react-icons/fa";

export default function Logo() {
    return (
        <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-brand">
            <FaTools /> GVE
        </Link>
    )
}