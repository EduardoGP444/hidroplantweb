import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from "firebase/database";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Lottie from 'react-lottie';
import animationData from '../../animacion/Animation - 1716432086673.json'; // Ajusta la ruta según la ubicación del archivo JSON
import { Fab, Action } from 'react-tiny-fab';
import 'react-tiny-fab/dist/styles.css';
import { Tooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css';
import { FaCameraRetro, FaPlus } from 'react-icons/fa';


const Monitoreo = () => {
  const [ultrasonicosData, setUltrasonicosData] = useState(null);
  const [sensoresData, setSensoresData] = useState(null);
  const [alturaPlanta, setAlturaPlanta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showParametros, setShowParametros] = useState(false);
  const [showAlert, setShowAlert] = useState(false);


  useEffect(() => {
    const db = getDatabase();
    const ultrasonicosRef = ref(db, 'Ultrasonicos');
    const sensoresRef = ref(db, 'sensores');
    const alturaPlantaRef = ref(db, 'alturaPlanta');

    onValue(ultrasonicosRef, (snapshot) => {
      const data = snapshot.val();
      setUltrasonicosData(data);
    });

    onValue(sensoresRef, (snapshot) => {
      const data = snapshot.val();
      setSensoresData(data);
    });

    onValue(alturaPlantaRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Datos de AlturaPlanta:", data);
      setAlturaPlanta(data);
      setLoading(false);
    });
  }, []);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  const Parametros = () => {
    const [principalMax, setPrincipalMax] = useState('');
    const [principalMin, setPrincipalMin] = useState('');
    const [reservaMax, setReservaMax] = useState('');
    const [reservaMin, setReservaMin] = useState('');
    const [nutrientesNiv, setNutrientes] = useState('');
    const [nutrientesMin, setNutrientesMin] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const maxOptions = [
      { value: '', label: 'Seleccione una opción' },
      { value: '750', label: '750 ml' },
      { value: '1000', label: '1000 ml' },
    ];

    const minOptions = [
      { value: '', label: 'Seleccione una opción' },
      { value: '250', label: '250 ml' },
      { value: '500', label: '500 ml' },
    ];

    const nutriOptions = [
      { value: '', label: 'Seleccione una opción' },
      { value: '1', label: '1 ml' },
      { value: '2', label: '2 ml' },
    ];

    const sendToArduino = async (url) => {
      try {
        const response = await fetch(url, {
          method: 'GET',
        });

        if (response.ok) {
          console.log('Datos enviados con éxito');
        } else {
          console.error('Error al enviar datos', await response.text());
        }
      } catch (error) {
        console.error('Error de red al enviar datos:', error);
      }
    };

    const handleValidation = () => {
      if (reservaMax === '' || reservaMin === '' || nutrientesNiv === '' || nutrientesMin === '') {
        setError('Todos los campos son obligatorios');
        setSuccess('');
      } else {
        const data = {
          principalMax,
          principalMin,
          reservaMax,
          reservaMin,
          nutrientesNiv,
          nutrientesMin,
        };

        if (reservaMax === '750') {
          sendToArduino('http:///192.168.75.242/encender4');
        } else if (reservaMax === '1000') {
          sendToArduino('http://192.168.75.242/encender3');
        }

        if (nutrientesNiv === '1') {
          sendToArduino('http://192.168.75.242/encender');
        } else if (nutrientesNiv === '2') {
          sendToArduino('http://192.168.75.242/encender1');
        }

        if (reservaMin === '250' || reservaMin === '500') {
          setShowAlert(true); // Mostrar la alerta si el nivel mínimo es 250 o 500
        }

        setError('');
        setSuccess('Datos guardados con éxito');
      }
    };


    return (
      <div className="max-w-lg mx-auto p-6 bg-green-50 shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Ingresar Parametros</h1>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Contenedor Principal</h2>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Alerta de Nivel Mínimo:</label>
            <select
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              value={principalMin}
              onChange={(e) => setPrincipalMin(e.target.value)}
            >
              {minOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Contenedor de Reserva</h2>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Llenar contenedor Principal:</label>
            <select
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              value={reservaMax}
              onChange={(e) => setReservaMax(e.target.value)}
            >
              {maxOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Alerta de Nivel Mínimo:</label>
            <select
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              value={reservaMin}
              onChange={(e) => setReservaMin(e.target.value)}
            >
              {minOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Contenedor de Nutrientes</h2>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Agregar nutrientes al contenedor Principal:</label>
            <select
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              value={nutrientesNiv}
              onChange={(e) => setNutrientes(e.target.value)}
            >
              {nutriOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Alerta de Nivel Mínimo:</label>
            <select
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              value={nutrientesMin}
              onChange={(e) => setNutrientesMin(e.target.value)}
            >
              {minOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}
        <button
          className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={handleValidation}
        >
          Guardar
        </button>
      </div>
    );
  };

  return (
    <div className='flex flex-col min-h-screen'>
      {/* Contenedor del logo y título */}
      <div className='flex items-center bg-green-200 p-4'>
        <div className='flex-1 flex justify-center'>
          <img src={process.env.PUBLIC_URL + "/img/titulo.png"} alt="Titulo" className='h-20 w-auto' />
        </div>
        <div className='ml-auto'>
          <img src={process.env.PUBLIC_URL + "/img/Logo 1.0.png"} alt="Logo" className='w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover shadow-md' />
        </div>
      </div>
      <br></br>

      {/* Botón flotante con icono de cámara */}
      <div className="fixed bottom-20 right-8 space-x-4 p-4">
        <Tooltip
          id="cameraTooltip"
          title="Haz clic para escanear la planta"
          place="left"
          effect="solid"
          trigger="mouseenter"
          arrow={true}
          duration={200}
          animation="shift"
          distance={20} // Ajusta la distancia del Tooltip al botón
          offset={20} // Ajusta el desplazamiento del Tooltip
        >
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full flex items-center"
            data-tooltip-id="cameraTooltip"
            onClick={() => window.open('http://192.168.75.236:5000/')}
          >
            <FaCameraRetro className="mr-2" />
          </button>
        </Tooltip>
      </div>




      {/* Botón flotante Parametros*/}
      <div className="fixed bottom-20 right-8 space-x-4 p-4">
        <Tooltip
          title="Haz clic para agregar parámetros"
          place="left"
          effect="solid"
          trigger="mouseenter"
          arrow={true}
          duration={200}
          animation="shift"
          distance={20} // Ajusta la distancia del Tooltip al botón
          offset={20} // Ajusta el desplazamiento del Tooltip
        >

          <button className="fixed bottom-10 right-10 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-lg focus:outline-none focus:shadow-outline"
            onClick={() => setShowParametros(true)}
          >
            +
          </button>
        </Tooltip>
      </div>

      {showParametros && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowParametros(false)}
            >
              &times;
            </button>
            <Parametros />
          </div>
        </div>
      )}

      <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center mb-6" style={{ fontFamily: 'Georgia' }}>Monitoreo de Contenedores</h2>

      {ultrasonicosData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="flex flex-col items-center">
            <p className="text-xl sm:text-2xl mb-6" style={{ fontFamily: 'Cambria' }}>Principal:</p>
            <div className="w-40 sm:w-48 lg:w-56">
              <CircularProgressbar
                value={ultrasonicosData.Principal}
                text={`${ultrasonicosData.Principal}`}
                strokeWidth={10}
                styles={{
                  root: { width: '100%' },
                  text: { fontSize: '16px', fill: '#75A47F' },
                }}
              />
            </div>
          </div>

          <div className="flex flex-col items-center">
            <p className="text-xl sm:text-2xl mb-6" style={{ fontFamily: 'Cambria' }}>Nutrientes:</p>
            <div className="w-40 sm:w-48 lg:w-56">
              <CircularProgressbar
                value={ultrasonicosData.Nutrientes}
                text={`${ultrasonicosData.Nutrientes}`}
                strokeWidth={10}
                styles={{
                  root: { width: '100%' },
                  text: { fontSize: '16px', fill: '#75A47F' },
                }}
              />
            </div>
          </div>

          <div className="flex flex-col items-center">
            <p className="text-xl sm:text-2xl mb-6" style={{ fontFamily: 'Cambria' }}>Reserva:</p>
            <div className="w-40 sm:w-48 lg:w-56">
              <CircularProgressbar
                value={ultrasonicosData.Reserva}
                text={`${ultrasonicosData.Reserva}`}
                strokeWidth={10}
                styles={{
                  root: { width: '100%' },
                  text: { fontSize: '16px', fill: '#75A47F' },
                }}
              />
            </div>
          </div>
        </div>
      )}

      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-6" style={{ fontFamily: 'Georgia' }}>Monitoreo de Sensores</h2>

      {showAlert && (
        <div className="text-red-500 mb-4">Los niveles de agua son bajos en uno de los contenedores</div>
      )}


      {sensoresData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col items-center">
            <p className="text-xl sm:text-2xl mb-6" style={{ fontFamily: 'Cambria' }}>Humedad:</p>
            <div className="w-40 sm:w-48 lg:w-56">
              <CircularProgressbar
                value={sensoresData.humedad}
                text={`${sensoresData.humedad}`}
                strokeWidth={10}
                styles={{
                  root: { width: '100%' },
                  text: { fontSize: '16px', fill: '#B99470' },
                }}
              />
            </div>
          </div>

          <div className="flex flex-col items-center">
            <p className="text-xl sm:text-2xl mb-6" style={{ fontFamily: 'Cambria' }}>Temperatura:</p>
            <div className="w-40 sm:w-48 lg:w-56">
              <CircularProgressbar
                value={sensoresData.temperatura}
                text={`${sensoresData.temperatura}`}
                strokeWidth={10}
                styles={{
                  root: { width: '100%' },
                  text: { fontSize: '16px', fill: '#AF8260' },
                }}
              />
            </div>
          </div>
        </div>
      )}

      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-6" style={{ fontFamily: 'Georgia' }}>Monitoreo de Altura de planta</h2>
      {alturaPlanta && (
        <div className="flex flex-col items-center">
          <div className="w-64 h-64">
            <Lottie options={defaultOptions} height={250} width={250} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mt-4">Altura de la planta: <span>{alturaPlanta}</span></h2>
        </div>
      )}
    </div>
  );
};

export default Monitoreo;

