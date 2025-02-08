import { ToastContainer } from "react-toastify";

export default function Toast() {
    return (
        <ToastContainer
            position="bottom-right"
            autoClose={8000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            toastClassName="bg-gray-800 text-white relative flex p-4 min-h-10 rounded-lg border-2 border-gray-700 justify-between overflow-hidden cursor-pointer"
            progressClassName="bg-blue-500"
        />
    )
}

