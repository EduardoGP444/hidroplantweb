import { getDatabase, ref, set } from "firebase/database";

// Función para escribir los datos en Firebase
function writeParametersData(principalMax, principalMin, reservaMax, reservaMin, nutrientesMax, nutrientesMin) {
  const db = getDatabase();
  set(ref(db, 'parametros'), {
    principalMax: principalMax,
    principalMin: principalMin,
    reservaMax: reservaMax,
    reservaMin: reservaMin,
    nutrientesMax: nutrientesMax,
    nutrientesMin: nutrientesMin
  })
  .then(() => {
    console.log("Datos de parámetros guardados exitosamente.");
  })
  .catch((error) => {
    console.error("Error al guardar los datos de parámetros: ", error);
  });
}

