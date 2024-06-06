import { getDatabase, ref, set } from "firebase/database";

// Define la función para escribir los datos de parámetros en la base de datos de Firebase
  export const writeParametrosData = (principalMax, principalMin, reservaMax, reservaMin, nutrientesMax, nutrientesMin) => {
    // Obtén la referencia de la base de datos
    const db = getDatabase();
  
    // Define la ruta donde se guardarán los datos de parámetros (en este ejemplo, se guarda en la colección 'parametros')
    const parametrosRef = ref(db, 'parametros');
  
    // Utiliza la función set() para guardar los datos en la referencia de la base de datos
    set(parametrosRef, {
      principalMax: principalMax,
      principalMin: principalMin,
      reservaMax: reservaMax,
      reservaMin: reservaMin,
      nutrientesMax: nutrientesMax,
      nutrientesMin: nutrientesMin
    })
    .then(() => {
      // En caso de éxito, muestra un mensaje de éxito en la consola
      console.log("Datos de parámetros guardados exitosamente.");
    })
    .catch((error) => {
      // En caso de error, muestra un mensaje de error en la consola
      console.error("Error al guardar los datos de parámetros: ", error);
    });
  };