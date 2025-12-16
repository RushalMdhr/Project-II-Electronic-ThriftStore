import React from 'react'
import { useState } from 'react';
import { toast, ToastContainer } from "react-toastify";

const AdminLogin = () => {

    const [name, setName] = useState("");
    const [user, setUser] = useState(null);
    const [mode, setMode] = useState('login');
    const endpoints = {
        login: "http://localhost:5000/user/login",
        create: "http://localhost:5000/user",
        switch: (name) => `http://localhost:5000/user/switch/${name}`,
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(endpoints[mode], {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            });

            const data = await res.json();
            if (!res.ok) return toast.error(data.message);

            setUser(data.user);
        } catch (error) {
            toast.error(error.message);
        }
    };


    const switchRole = (role) => async () => {
        try {
            const res = await fetch(endpoints.switch(name), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ role })
            });
            const data = await res.json();
            if (!res.ok) return toast.error(data.error);
            setUser((prev) => ({ ...prev, role: data.role || role }));
            toast.success(`Role changed to ${role}`);
        } catch (error) {
            console.error(error)
        }
    }
    return (
        user ? (<>
            <ToastContainer />
            {user ? <>
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-200 via-cyan-100 to-white">
                    <div className="w-full max-w-md p-10 bg-white rounded-3xl shadow-2xl border border-cyan-300">
                        <h2 className="text-3xl font-extrabold text-cyan-500 mb-8 text-center tracking-wide drop-shadow">
                            {user.name}
                        </h2>
                        <h2 className="text-3xl font-extrabold text-cyan-700 mb-8 text-center tracking-wide drop-shadow">
                            Role : {user.role}
                        </h2>

                        <button
                            type="submit"
                            className="w-full py-3 bg-gradient-to-r from-cyan-400 m-1 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:from-cyan-500 hover:to-cyan-700 transition text-lg"
                            onClick={switchRole('vendor')}
                        >
                            Change Role To Vendor ?
                        </button>
                        <button
                            type="submit"
                            className="w-full py-3 bg-gradient-to-r from-cyan-400 m-1 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:from-cyan-500 hover:to-cyan-700 transition text-lg"
                            onClick={switchRole('admin')}
                        >
                            Change Role To Admin
                        </button>
                    </div>
                </div>
                <h1><b>{user.name}</b></h1>
                <h2>Role : {user.role}</h2>
                <button className='w-full py-3 bg-gradient-to-r from-cyan-400 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:from-cyan-500 hover:to-cyan-700 transition text-lg'>Want to be Admin</button>
            </>




                : <></>}
        </>

        ) : (
            <>
                <ToastContainer />
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-200 via-cyan-100 to-white">
                    <div className="w-full max-w-md p-10 bg-white rounded-3xl shadow-2xl border border-cyan-300">
                        <h2 className="text-3xl font-extrabold text-cyan-700 mb-8 text-center tracking-wide drop-shadow">
                            {mode === 'login' ? (<>LOGIN</>) : (<>CREATE</>)}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <input
                                type="text"
                                placeholder="Enter Name"
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                                className="w-full px-5 py-3 border border-cyan-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 text-gray-700 text-lg transition"
                            />
                            <button
                                type="submit"
                                className="w-full py-3 bg-gradient-to-r from-cyan-400 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:from-cyan-500 hover:to-cyan-700 transition text-lg"
                            >
                                {mode === 'login' ? (<>Login</>) : (<>Create</>)}
                            </button>
                        </form>
                        {/* {mode==='login'? (
                            <button
                            className="btn mx-30 py-3 bg-cyan-100 text-cyan-600 m-3 p-2 rounded-2xl border-2 border-cyan-600 hover:bg-cyan-200"
                            onClick={(e)=>setMode('create')}
                        >
                            Create User
                        </button>
                        ) : (
                            <button
                            className="btn mx-30 py-3 bg-cyan-100 text-cyan-600 m-3 p-2 rounded-2xl border-2 border-cyan-600 hover:bg-cyan-200"
                            onClick={(e)=>setMode('login')}
                        >
                            Login
                        </button>
                        )} */}
                        <button
                            className="btn mx-30 py-3 bg-cyan-100 text-cyan-600 m-3 p-2 rounded-2xl border-2 border-cyan-600 hover:bg-cyan-200"
                            onClick={() => setMode(mode === "login" ? "create" : "login")}
                        >
                            {mode === "login" ? "Create User" : "Login"}
                        </button>

                    </div>
                </div>
            </>
        )
    );
}

export default AdminLogin
