import React, { useState } from 'react';
import { useAuth } from '../../contexts/authContext';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const Home = () => {
    const { currentUser } = useAuth();
    const [showInfo, setShowInfo] = useState(false);

    const toggleInfo = () => {
        setShowInfo(!showInfo);
    };

    return (
        <div className="bg-white">
            {/* Barra de navegación */}
            <div className="p-2 flex flex-col sm:flex-row justify-between items-center bg-green-100">
                {/* Logo */}
                <img
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover shadow-md mb-2 sm:mb-0"
                    src={process.env.PUBLIC_URL + "/img/Logo 1.0.png"} 
                    alt="Logo"
                />

                {/* Título */}
                <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 text-center mb-2 sm:mb-0">
                    ¡Bienvenido a Hidroplant!
                </h2>

                {/* Usuario */}
                <p className="text-center text-lg sm:text-xl text-gray-600 my-4 sm:my-6">
                    Hola, {currentUser.displayName ? currentUser.displayName : currentUser.email}.
                </p>
            </div>
            
            <div className="p-6  ">
                {/* Carrusel de imágenes */}
                <div className="mt-4 ">
                    <Carousel showThumbs={false} autoPlay infiniteLoop>
                        <div>
                            <img className="w-full h-96 object-cover" src="/img/fresa.jpg" alt="Fresa" />
                        </div>
                        <div>
                            <img className="w-full h-96 object-cover" src="/img/1.jpg" alt="Fresas" />
                        </div>
                        <div>
                            <img className="w-full h-96 object-cover" src="/img/8.jpg" alt="Fresas" />
                        </div>
                        <div>
                            <img className="w-full h-96 object-cover" src="/img/4.jpg" alt="Fresas" />
                        </div>
                    </Carousel>
                </div>
                <br />

                <div className="relative mb-8">
                    <h2 className="text-center text-2xl sm:text-3xl font-bold mb-6" style={{ fontFamily: 'Georgia' }}>
                        Detalles de la planta
                        
                    </h2>

                    <button 
                        className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-2 rounded shadow-lg"
                        onClick={toggleInfo}
                    >
                        +
                    </button>
                </div>

                {showInfo && (
                    <div className="bg-emerald-100 w-2/3 sm:w-1/2 mx-auto mb-8 p-4 rounded-md shadow-md">
                        <div className="flex flex-col sm:flex-row w-full">
                            <div className="w-full sm:w-1/3 p-2">
                                <img className="w-20 h-20 object-cover" src="/img/dato.png" alt="Fresas" />
                            </div>
                            <div className="w-full sm:w-2/3 p-2 text-left">
                                <h2 className="text-sm sm:text-lg font-medium text-gray-900 mb-2" style={{ fontFamily: 'Georgia' }}>
                                    Dato
                                </h2>
                                <p className="text-gray-700 text-xs sm:text-sm sm:text-justify" style={{ fontFamily: 'Segoe UI Symbol' }}>
                                    En hidroponía, la tierra se reemplaza por un medio de cultivo que sostiene las plantas y proporciona un ancla estable para las raíces. Los medios de cultivo comunes para las fresas hidropónicas incluyen fibra de coco, perlita y vermiculita.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="text-lg sm:text-2xl text-gray-700 mb-6" style={{ fontFamily: 'Noto Color Emoji' }}>
                    <span className="font-semibold">Nombre común:</span> Fresa
                </div>
                <div className="text-lg sm:text-2xl text-gray-700 mb-6" style={{ fontFamily: 'Noto Color Emoji' }}>
                    <span className="font-semibold">Nombre científico:</span> Fragaria
                </div>

                <div className="bg-teal-100 w-full">
                    <div className="flex flex-col sm:flex-row w-full">
                        <div className="w-full sm:w-2/3 p-6 text-left">
                            <h2 className="text-xl sm:text-xl font-medium text-gray-900 mb-2" style={{ fontFamily: 'Georgia' }}>
                                Nutrientes recomendados 
                            </h2>
                            <p className="text-gray-700 mb-4 sm:text-justify text-lg" style={{ fontFamily: 'Liberation Mono' }}>
                                Nitrato de Calcio: Proporciona una fuente de calcio y nitrógeno para promover el crecimiento de las plantas y prevenir la pudrición apical de los frutos.
                                <br /><br />
                                Sulfato de Magnesio: Es una fuente de magnesio y azufre, importantes para la formación de clorofila y el funcionamiento de las enzimas en las plantas.
                                <br /><br />
                                Fosfato de Potasio: Contiene fósforo y potasio, dos nutrientes clave para el desarrollo de frutos y la producción de flores.
                                <br /><br />
                                Para obtener más información, visita: {' '}
                                <a href="https://www.intagri.com/articulos/frutillas/sistema-hidroponicos-soluciones-nutritivas-fresa" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                                    Sistemas Hidropónicos y Soluciones Nutritivas para Fresas
                                </a>
                            </p>

                        </div>
                        <div className="w-full sm:w-1/3 p-4">
                            <div className="relative pb-1/1 sm:pb-0 sm:h-full">
                                <img className="absolute inset-0 w-full h-full object-cover" src="/img/nutrientes.jpg" alt="Nutrientes" />
                            </div>
                        </div>
                    </div>
                </div>
                <br />

                <div className="bg-cyan-100 w-full flex flex-col sm:flex-row">
                    <div className="w-full sm:w-1/3 p-4">
                        <img className="w-full h-full object-cover" src="/img/cuidados.jpg" alt="Fresas" />
                    </div>
                    <div className="w-full sm:w-2/3 p-6 text-left">
                        <h2 className="text-xl sm:text-xl font-medium text-gray-900 mb-2" style={{ fontFamily: 'Georgia' }}>
                            Recomendaciones
                        </h2>
                        <p className="text-gray-700 mb-4 sm:text-justify text-lg" style={{ fontFamily: 'Liberation Mono' }}>
                            Higiene: Mantén un ambiente limpio y desinfectado en tu sistema hidropónico. Limpia regularmente los tanques de nutrientes, tuberías, contenedores y cualquier otra superficie para evitar la acumulación de patógenos.
                            <br /><br />
                            Buena ventilación: Asegúrate de que haya una buena circulación de aire alrededor de tus plantas. Esto ayuda a reducir la humedad en el ambiente, lo que a su vez puede prevenir el desarrollo de enfermedades fúngicas como el mildiu y la botritis.
                            <br /><br />
                            Control de la humedad: Evita el exceso de humedad alrededor de las plantas, especialmente en los sistemas hidropónicos donde el exceso de agua puede ser un problema.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;



