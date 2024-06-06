import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/authContext';
import { collection, getDocs } from "firebase/firestore"; 
import { db } from '../../firebase/firebase';

const Perfil = () => {
    const { currentUser } = useAuth();
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const usuariosCollection = collection(db, "usuarios");
                const querySnapshot = await getDocs(usuariosCollection);
                querySnapshot.forEach((doc) => {
                    setUserProfile(doc.data());
                });
            } catch (error) {
                console.error("Error al obtener el perfil:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    if (loading) {
        return <p>Cargando perfil...</p>;
    }

    return (
        <div>
            <h2>Perfil de Usuario</h2>
            {userProfile ? (
                <ul>
                    <li>Nombre: {userProfile.nombre}</li>
                    <li>Apellido: {userProfile.apellido}</li>
                    <li>Correo: {currentUser.email}</li>
                </ul>
            ) : (
                <p>No se encontró ningún perfil.</p>
            )}
        </div>
    );
}

export default Perfil;
