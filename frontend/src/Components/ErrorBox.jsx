

function ErrorBox({ children }) {
    return (
        <div className="text-2xl p-5 text-red-500 border-2 border-red-500 rounded-xl m-5">
            {children}
        </div>
    )
}

export default ErrorBox