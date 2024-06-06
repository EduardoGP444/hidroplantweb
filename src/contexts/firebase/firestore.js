import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";


const Name = async (nombre, apellido) => {
    try {
        const usuariosCollectionRef = collection(db, "usuarios");

        const nuevoUsuarioDocRef = doc(usuariosCollectionRef);

        await setDoc(nuevoUsuarioDocRef, {
            nombre: nombre,
            apellido: apellido
        });

        console.log("Nombre y apellido guardados exitosamente en Firestore.");
    } catch (error) {
        console.error("Error al guardar nombre y apellido:", error);
    }
};

export default Name;
