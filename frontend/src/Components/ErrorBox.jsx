

function ErrorBox({ children }) {
    return (
        <div className="text-2xl p-5 text-red-500 text-center rounded-xl m-5">
            {children}
        </div>
    )
}

export default ErrorBox