import React from 'react'

const AdminLogin = () => {

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:5000/user/")
        } catch (error) {
            
        }
    }
return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-200 via-cyan-100 to-white">
        <div className="w-full max-w-md p-10 bg-white rounded-3xl shadow-2xl border border-cyan-300">
            <h2 className="text-3xl font-extrabold text-cyan-700 mb-8 text-center tracking-wide drop-shadow">
                Admin Login
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <input
                    type="text"
                    placeholder="Enter Admin Username"
                    className="w-full px-5 py-3 border border-cyan-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 text-gray-700 text-lg transition"
                />
                <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-cyan-400 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:from-cyan-500 hover:to-cyan-700 transition text-lg"
                >
                    Login as Admin
                </button>
            </form>
        </div>
    </div>
)
}

export default AdminLogin
