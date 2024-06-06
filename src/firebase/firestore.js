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
    } catch (error) {
        console.error(error);
    }
};

export default Name;
