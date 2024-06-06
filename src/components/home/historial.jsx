import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { getDatabase, ref, onValue } from "firebase/database";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Chart from 'chart.js/auto';



const Historial = () => {
    const [historial, setHistorial] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [historialEncontrado, setHistorialEncontrado] = useState(true);
    const [maxTemperatura, setMaxTemperatura] = useState(null);
    const [minTemperatura, setMinTemperatura] = useState(null);
    const [alturaPlantaHistorial, setAlturaPlantaHistorial] = useState([]);

    const firestore = getFirestore();

    useEffect(() => {
        const db = getDatabase();
        const alturaPlantaRef = ref(db, 'alturaPlanta');

        const fetchAlturaPlanta = async () => {
            onValue(alturaPlantaRef, (snapshot) => {
                const alturaData = snapshot.val();
                if (alturaData) {
                    const fecha = new Date().toLocaleDateString();
                    const altura = parseFloat(alturaData);

                    setAlturaPlantaHistorial(prevHistorial => [...prevHistorial, { fecha: fecha, altura: altura }]);
                }
            });
        };

        fetchAlturaPlanta();
    }, []);

    useEffect(() => {
        const fetchHistorial = async () => {
            const start = startDate.toLocaleDateString();
            const end = endDate.toLocaleDateString();

            const historialRef = collection(firestore, "historial");
            const q = query(historialRef, where("fecha", ">=", start), where("fecha", "<=", end));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setHistorialEncontrado(false);
            } else {
                let maxTemp = null;
                let minTemp = null;
                const fetchedHistorial = [];

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    fetchedHistorial.push(data);

                    const temp = parseFloat(data.temperatura);
                    if (maxTemp === null || temp > maxTemp) {
                        maxTemp = temp;
                    }
                    if (minTemp === null || temp < minTemp) {
                        minTemp = temp;
                    }
                });

                setHistorial(fetchedHistorial);
                setMaxTemperatura(maxTemp);
                setMinTemperatura(minTemp);
                setHistorialEncontrado(true);
            }
        };

        fetchHistorial();
    }, [startDate, endDate]);

    const datosGraficoAltura = {
        labels: alturaPlantaHistorial.map(item => item.fecha),
        datasets: [
            {
                label: 'Altura de la Planta (cm)',
                data: alturaPlantaHistorial.map(item => item.altura),
                borderColor: 'rgba(37, 207, 237, 1)',
                backgroundColor: 'rgba(132, 248, 202, 0.5)',
                fill: true,
                tension: 0.1,
            },
        ],
    };

    const opcionesGraficoAltura = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Fecha',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Altura (cm)',
                },
                beginAtZero: true,
            },
        },
    };

    const generarPDF = () => {
        const doc = new jsPDF();
    
        // Título y encabezado
        const title = "Historial de Temperatura y Altura de la Planta";
        const startDateFormatted = startDate.toLocaleDateString();
        const endDateFormatted = endDate.toLocaleDateString();
        const dateRange = `(${startDateFormatted} - ${endDateFormatted})`;
        const fullTitle = `${title} ${dateRange}`;
        doc.setFontSize(18);
        doc.setTextColor(0, 128, 0); // Cambiar color a verde (RGB: 0, 128, 0)
        doc.text(fullTitle, 14, 20);
    
        // Datos de temperatura
        doc.setTextColor(0); // Restaurar color a negro
        doc.setFontSize(14);
        const temperaturaData = [
            ['Tipo', 'Temperatura (°C)'],
            ['Máxima', maxTemperatura !== null ? maxTemperatura : 'N/A'],
            ['Mínima', minTemperatura !== null ? minTemperatura : 'N/A']
        ];
        doc.autoTable({
            startY: 30,
            headStyles: { fillColor: [204, 255, 204], textColor: [0, 128, 0], fontStyle: 'bold' }, // Estilo de encabezado similar al de altura de la planta
            bodyStyles: { textColor: 0 },
            body: temperaturaData
        });
    
        // Datos de altura
        doc.setTextColor(0, 128, 0); // Cambiar color a verde
        doc.setFontSize(14);
        doc.text("Altura de la Planta", 14, doc.autoTable.previous.finalY + 10);
        doc.setTextColor(0); // Restaurar color a negro
    
        // Crear una tabla para mostrar los datos de altura
        const data = alturaPlantaHistorial.map(({ fecha, altura }) => [fecha, altura]);
        doc.autoTable({
            startY: doc.autoTable.previous.finalY + 20,
            head: [['Fecha', 'Altura (cm)']],
            headStyles: { fillColor: [204, 255, 204], textColor: [0, 128, 0], fontStyle: 'bold' }, // Estilo de encabezado similar al de altura de la planta
            bodyStyles: { fillColor: [255, 255, 255] }, // Cambiar color de fondo de las filas a blanco
            body: data
        });
    
        doc.save("historial.pdf");
    };
    
    

    return (
        <div className='flex flex-col min-h-screen'>
            <div className='flex items-center bg-green-200 p-4'>
                <div className='flex-1 flex justify-center'>
                    <img src={process.env.PUBLIC_URL + "/img/titulo.png"} alt="Titulo" className='h-20 w-auto' />
                </div>
                <div className='ml-auto'>
                    <img src={process.env.PUBLIC_URL + "/img/Logo 1.0.png"} alt="Logo" className='w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover shadow-md' /> 
                </div>
            </div>
            <br></br>
            
            <div className='flex flex-col md:flex-row flex-1'>
                <div className='flex-1'>
                    <img src={process.env.PUBLIC_URL + "/img/histo.jpg"} alt="Descripción de la imagen" className='w-full h-auto' />
                </div>
                <div className='flex-1 text-2xl font-bold pt-14 px-4'>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center mb-6" style={{ fontFamily: 'Georgia' }}>Resumen del día:</h2>
                    
                    <div className="flex flex-col items-center sm:items-end mt-4 mr-0 sm:mr-8">
                        <p className="text-lg mb-2" style={{ fontFamily: 'Consolas' }}>Seleccionar fechas</p>
                        <div className="flex items-center">
                            <DatePicker
                                selected={startDate}
                                onChange={date => setStartDate(date)}
                                dateFormat="dd/MM/yyyy"
                                className="border border-green-400 rounded px-2 py-1 focus:outline-none focus:border-blue-500 mr-4" 
                                style={{ fontSize: '1rem', color: 'blue' }} 
                            />
                            <DatePicker
                                selected={endDate}
                                onChange={date => setEndDate(date)}
                                dateFormat="dd/MM/yyyy"
                                className="border border-green-400 rounded px-2 py-1 focus:outline-none focus:border-blue-500" 
                                style={{ fontSize: '1rem', color: 'blue' }} 
                            />
                        </div>
                    </div>
                    <br/><br/>

                    {historialEncontrado ? (
                        <>
                            {historial.length > 0 && (
                                <div className="px-4 sm:px-8">
                                    <p className="text-2xl mb-6" style={{ fontFamily: 'Consolas' }}>Fecha: {historial[0].fecha}</p>
                                    <br/>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 justify-center items-center">
                                        <div className="text-2xl mb-6" style={{ fontFamily: 'Cambria', width: '100%' }}>Temperatura 
                                            <div style={{ width: 250, height: 250 }}>
                                                <CircularProgressbar
                                                    value={maxTemperatura !== null ? maxTemperatura : 0}
                                                    text={`Máx: ${maxTemperatura !== null ? maxTemperatura + " °C" : "Cargando..."}`}
                                                    strokeWidth={10}
                                                    styles={{
                                                        root: { width: '100%', height: '100%' },
                                                        text: { fontSize: '16px', fill: '#A91D3A' },
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="text-2xl mb-6" style={{ fontFamily: 'Cambria', width: '100%' }}>
                                            <div style={{ width: 250, height: 250 }}>
                                                <CircularProgressbar
                                                    value={minTemperatura !== null ? minTemperatura : 0}
                                                    text={`Mín: ${minTemperatura !== null ? minTemperatura + " °C" : "Cargando..."}`}
                                                    strokeWidth={10}
                                                    styles={{
                                                        root: { width: '100%', height: '100%' },
                                                        text: { fontSize: '16px', fill: '#A91D3A' },
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {alturaPlantaHistorial.length > 0 && (
                                <div className="mt-8">
                                    <h3 className="text-2xl mb-4" style={{ fontFamily: 'Georgia' }}>Altura de la Planta:</h3>
                                    <Line data={datosGraficoAltura} options={opcionesGraficoAltura} />
                                </div>
                            )}
                        </>
                    ) : (
                        <p>No hay datos disponibles para las fechas seleccionadas.</p>
                    )}
                </div>
            </div>
            <button onClick={generarPDF} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4">Generar PDF</button>
        </div>
    );
}

export default Historial;

