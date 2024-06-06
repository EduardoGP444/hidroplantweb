import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import { doSignOut } from '../../firebase/auth';

const Sidebar = () => {
    const navigate = useNavigate();
    const { userLoggedIn } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="flex">
            <div className={`fixed inset-y-0 left-0 z-10 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out bg-[#65B741] shadow-md w-64`}>
                <div className="flex items-center justify-between h-16 px-4">
                    <div className="text-white font-bold text-xl">HidroPlant</div>
                    <button onClick={toggleSidebar} className="text-white focus:outline-none">
                        {isOpen ? '✖' : '☰'}
                    </button>
                </div>
                <div className="mt-5 flex flex-col space-y-4 px-4">
                    {userLoggedIn && (
                        <>
                            <Link to="/home" className="text-white hover:bg-[#527853] hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</Link>
                            <Link to="/monitoreo" className="text-white hover:bg-[#527853] hover:text-white px-3 py-2 rounded-md text-sm font-medium">Monitoreo</Link>
                            <Link to="/historial" className="text-white hover:bg-[#527853] hover:text-white px-3 py-2 rounded-md text-sm font-medium">Historial</Link>
                            <button onClick={() => { doSignOut().then(() => { navigate('/login') }) }} className="text-white hover:bg-[#527853] hover:text-white px-3 py-2 rounded-md text-sm font-medium">Cerrar sesión</button>
                        </>
                    )}
                </div>
            </div>
            <div className="flex-1 p-4">
                <button onClick={toggleSidebar} className="text-[#65B741] text-2xl focus:outline-none z-20">
                    {isOpen ? '✖' : '☰'} 
                </button>
            </div>
        </div>
    );
};

export default Sidebar;





