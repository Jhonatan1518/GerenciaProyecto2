import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Plot from 'react-plotly.js';
import Papa from 'papaparse';
import '../styles/PremierLeagueAnalytics.css'; // Asegúrate que esta ruta sea correcta para tu proyecto

// Objeto de mapeo para nombres de columnas técnicos a nombres amigables en español
const columnDisplayNames = {
    'Date': 'Fecha',
    'HomeTeam': 'Equipo Local',
    'AwayTeam': 'Equipo Visitante',
    'FTHG': 'Goles Local (Tiempo Completo)',
    'FTAG': 'Goles Visitante (Tiempo Completo)',
    'FTR': 'Resultado (Tiempo Completo)', // H (Home), D (Draw), A (Away)
    'HTHG': 'Goles Local (Medio Tiempo)',
    'HTAG': 'Goles Visitante (Medio Tiempo)',
    'HTR': 'Resultado (Medio Tiempo)',
    'HS': 'Tiros Local',
    'AS': 'Tiros Visitante',
    'HST': 'Tiros a Puerta Local',
    'AST': 'Tiros a Puerta Visitante',
    'HF': 'Faltas Local',
    'AF': 'Faltas Visitante',
    'HC': 'Córners Local',
    'AC': 'Córners Visitante',
    'HY': 'Tarjetas Amarillas Local',
    'AY': 'Tarjetas Amarillas Visitante',
    'HR': 'Tarjetas Rojas Local',
    'AR': 'Tarjetas Rojas Visitante',
    'B365H': 'Cuota B365 Local',
    'B365D': 'Cuota B365 Empate',
    'B365A': 'Cuota B365 Visitante',
    'BWH': 'Cuota BW Local',
    'BWD': 'Cuota BW Empate',
    'BWA': 'Cuota BW Visitante',
    'IWH': 'Cuota IW Local',
    'IWD': 'Cuota IW Empate',
    'IWA': 'Cuota IW Visitante',
    'LBH': 'Cuota LB Local',
    'LBD': 'Cuota LB Empate',
    'LBA': 'Cuota LB Visitante',
    'PSH': 'Cuota PS Local',
    'PSD': 'Cuota PS Empate',
    'PSA': 'Cuota PS Visitante',
    'WHH': 'Cuota WH Local',
    'WHD': 'Cuota WH Empate',
    'WHA': 'Cuota WH Visitante',
    'SJH': 'Cuota SJ Local',
    'SJD': 'Cuota SJ Empate',
    'SJA': 'Cuota SJ Visitante',
    'VCH': 'Cuota VC Local',
    'VCD': 'Cuota VC Empate',
    'VCA': 'Cuota VC Visitante',
    'Bb1X2': 'Apuestas en 1x2',
    'BbMxH': 'Apuesta Máx. Local',
    'BbAvH': 'Apuesta Prom. Local',
    'BbMxD': 'Apuesta Máx. Empate',
    'BbAvD': 'Apuesta Prom. Empate',
    'BbMxA': 'Apuesta Máx. Visitante',
    'BbAvA': 'Apuesta Prom. Visitante',
    'BbOU': 'Apuestas Over/Under',
    'BbMx>2.5': 'Apuesta Máx. Over 2.5',
    'BbAv>2.5': 'Apuesta Prom. Over 2.5',
    'BbMx<2.5': 'Apuesta Máx. Under 2.5',
    'BbAv<2.5': 'Apuesta Prom. Under 2.5',
    'GBH': 'Cuota GB Local',
    'GBD': 'Cuota GB Empate',
    'GBA': 'Cuota GB Visitante',
    'BSH': 'Cuota BS Local',
    'BSD': 'Cuota BS Empate',
    'BSA': 'Cuota BS Visitante',
    'MW': 'Jornada', // Asumiendo que MW es Match Week o Jornada
    'DiffPts': 'Diferencia de Puntos', // Nombre inventado si no está en CSV
    'EloHome': 'Elo Equipo Local',
    'EloAway': 'Elo Equipo Visitante',
    // Puedes añadir más si tu dataset tiene otras columnas que necesites traducir
};


// Función para obtener nombres de columnas (opcionalmente solo numéricas)
const getColumnInfo = (data) => {
    if (!data || data.length === 0) return { all: [], numeric: [], categorical: [], date: [] };
    const sample = data[0];
    const all = Object.keys(sample).filter(key => key !== 'DateObject'); // Excluir DateObject interna
    const numeric = all.filter(key => typeof sample[key] === 'number' || (typeof sample[key] === 'string' && !isNaN(parseFloat(sample[key])) && String(parseFloat(sample[key])).length === sample[key].length));
    const date = all.filter(key => key === 'Date');
    const categorical = all.filter(key => !numeric.includes(key) && !date.includes(key) && key !== 'DateObject');
    return { all, numeric, categorical, date };
};

const PremierLeagueAnalytics = () => {
    const [rawData, setRawData] = useState([]);
    const [columnInfo, setColumnInfo] = useState({ all: [], numeric: [], categorical: [], date: [] });
    const [teamNames, setTeamNames] = useState({ home: [], away: [], ftr: [] }); // Añadir ftr aquí

    const [selectedXAxis, setSelectedXAxis] = useState('');
    const [selectedYAxis, setSelectedYAxis] = useState('');
    const [selectedChartType, setSelectedChartType] = useState('scatter');
    const [selectedMarkerColor, setSelectedMarkerColor] = useState('');
    const [selectedMarkerSize, setSelectedMarkerSize] = useState('');

    const [filterHomeTeam, setFilterHomeTeam] = useState('');
    const [filterAwayTeam, setFilterAwayTeam] = useState('');
    const [filterFTR, setFilterFTR] = useState(''); // Filtro por resultado (H, D, A)

    const [plotConfig, setPlotConfig] = useState({ data: [], layout: {} });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Carga y parseo de datos CSV
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch('/final_dataset.csv'); // Asegúrate que tu CSV está en la carpeta 'public'
                if (!response.ok) throw new Error(`Error al cargar CSV: ${response.statusText}`);
                const csvText = await response.text();

                Papa.parse(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    dynamicTyping: false,
                    complete: (results) => {
                        if (results.errors.length) {
                            console.error("Errores de parseo CSV:", results.errors);
                            setError("Error parseando el CSV. Revisa la consola.");
                            setRawData([]);
                        } else {
                            const processed = results.data.map(row => {
                                const newRow = { ...row };
                                if (newRow.Date) {
                                    const parts = String(newRow.Date).split('/');
                                    if (parts.length === 3) {
                                        const day = parseInt(parts[0], 10);
                                        const month = parseInt(parts[1], 10) - 1;
                                        let year = parseInt(parts[2], 10);
                                        if (year < 100) year += 2000;
                                        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
                                            newRow.DateObject = new Date(year, month, day);
                                        } else { newRow.DateObject = null; }
                                    } else { newRow.DateObject = null; }
                                }
                                Object.keys(newRow).forEach(key => {
                                    const val = newRow[key];
                                    if (key !== 'Date' && key !== 'HomeTeam' && key !== 'AwayTeam' && key !== 'FTR' && !key.includes('FormPtsStr') && !key.startsWith('HM') && !key.startsWith('AM')) {
                                        if (val !== null && val !== '' && !isNaN(Number(val))) {
                                            newRow[key] = Number(val);
                                        }
                                    }
                                });
                                return newRow;
                            });
                            setRawData(processed);
                        }
                        setLoading(false);
                    },
                    error: (err) => {
                        console.error("Error en PapaParse:", err);
                        setError("Error crítico parseando CSV.");
                        setLoading(false);
                    }
                });
            } catch (e) {
                console.error("Error fetching CSV:", e);
                setError(`No se pudo cargar el archivo de datos: ${e.message}`);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Establecer selecciones iniciales y listas de columnas/equipos cuando los datos estén listos
    useEffect(() => {
        if (rawData.length > 0) {
            const colInfo = getColumnInfo(rawData);
            setColumnInfo(colInfo);

            // Selecciones iniciales con nombres de columnas lógicos
            setSelectedXAxis(colInfo.date[0] || colInfo.categorical[0] || colInfo.numeric[0] || colInfo.all[0] || '');
            setSelectedYAxis(colInfo.numeric.find(c => c === "FTHG") || colInfo.numeric[0] || ''); 
            setSelectedMarkerColor(colInfo.numeric.find(c => c === "DiffPts") || '');
            setSelectedMarkerSize(colInfo.numeric.find(c => c === "MW") || '');

            const homeTeams = [...new Set(rawData.map(d => d.HomeTeam))].sort();
            const awayTeams = [...new Set(rawData.map(d => d.AwayTeam))].sort();
            const ftrValues = [...new Set(rawData.map(d => d.FTR))].sort();
            setTeamNames({ home: homeTeams, away: awayTeams, ftr: ftrValues });
        }
    }, [rawData]);

    // Memoizar datos filtrados
    const filteredData = useMemo(() => {
        return rawData.filter(row => {
            const homeTeamMatch = filterHomeTeam ? row.HomeTeam === filterHomeTeam : true;
            const awayTeamMatch = filterAwayTeam ? row.AwayTeam === filterAwayTeam : true;
            const ftrMatch = filterFTR ? row.FTR === filterFTR : true;
            return homeTeamMatch && awayTeamMatch && ftrMatch;
        });
    }, [rawData, filterHomeTeam, filterAwayTeam, filterFTR]);

    // Generar configuración del gráfico
    const generatePlotData = useCallback(() => {
        if (!selectedXAxis || !selectedYAxis || filteredData.length === 0) {
            setPlotConfig({ data: [], layout: { title: 'Selecciona ejes y/o aplica filtros para ver datos' } });
            return;
        }

        let xData = filteredData.map(d => selectedXAxis === 'Date' ? d.DateObject : d[selectedXAxis]);
        let yData = filteredData.map(d => d[selectedYAxis]);

        let hoverText = filteredData.map(d => {
            let text = `<b>${d.HomeTeam} ${d.FTHG} - ${d.FTAG} ${d.AwayTeam}</b> (${d.Date})<br>`;
            text += `${columnDisplayNames[selectedXAxis] || selectedXAxis}: ${d[selectedXAxis]}<br>`; // Usar nombre amigable
            text += `${columnDisplayNames[selectedYAxis] || selectedYAxis}: ${d[selectedYAxis]}`; // Usar nombre amigable
            if (selectedMarkerColor && d[selectedMarkerColor] !== undefined) text += `<br>${columnDisplayNames[selectedMarkerColor] || selectedMarkerColor}: ${d[selectedMarkerColor]}`;
            if (selectedMarkerSize && d[selectedMarkerSize] !== undefined) text += `<br>${columnDisplayNames[selectedMarkerSize] || selectedMarkerSize}: ${d[selectedMarkerSize]}`;
            return text;
        });
        
        if (selectedXAxis === 'Date') {
            const points = xData.map((date, i) => ({
                date,
                y: yData[i],
                text: hoverText[i],
                original: filteredData[i]
            }));
            
            const validPoints = points.filter(p => p.date instanceof Date && !isNaN(p.date));

            validPoints.sort((a, b) => a.date.getTime() - b.date.getTime());
            
            xData = validPoints.map(p => p.date);
            yData = validPoints.map(p => p.y);
            hoverText = validPoints.map(p => p.text); 
        }

        const trace = {
            x: xData,
            y: yData,
            text: hoverText,
            hoverinfo: 'text',
            type: selectedChartType,
            mode: selectedChartType === 'scatter' ? 'markers' : (selectedChartType === 'line' ? 'lines+markers' : undefined),
        };

        if (selectedChartType === 'scatter' || selectedChartType === 'line') {
            trace.marker = { size: 10 };
            if (selectedMarkerColor && columnInfo.numeric.includes(selectedMarkerColor)) {
                trace.marker.color = filteredData.map(d => d[selectedMarkerColor]);
                trace.marker.colorscale = 'Viridis';
                trace.marker.showscale = true;
                trace.marker.colorbar = { title: columnDisplayNames[selectedMarkerColor] || selectedMarkerColor, thickness: 15, len:0.75, y:0.45 };
            } else {
                trace.marker.color = 'rgba(0,123,255,0.7)';
            }
            if (selectedMarkerSize && columnInfo.numeric.includes(selectedMarkerSize)) {
                const sizeValues = filteredData.map(d => Math.max(5, Math.abs(Number(d[selectedMarkerSize])) / 2 || 5));
                if (sizeValues.some(s => !isNaN(s) && s > 0)) {
                    trace.marker.size = sizeValues;
                }
            }
        } else if (selectedChartType === 'bar') {
            trace.marker = { color: 'rgba(0,123,255,0.7)' };
            if (columnInfo.categorical.includes(selectedXAxis) || selectedXAxis === 'Date') {
                const aggregated = {};
                filteredData.forEach((row, i) => {
                    const xVal = selectedXAxis === 'Date' ? row.DateObject : row[selectedXAxis];
                    const yVal = parseFloat(row[selectedYAxis]);
                    if (!isNaN(yVal)) {
                        if (!aggregated[xVal]) {
                            aggregated[xVal] = { sum: 0, count: 0, values: [] };
                        }
                        aggregated[xVal].sum += yVal;
                        aggregated[xVal].count += 1;
                        aggregated[xVal].values.push(yVal);
                    }
                });
                
                const aggX = Object.keys(aggregated);
                const aggY = Object.values(aggregated).map(val => val.sum / val.count);
                const aggText = Object.entries(aggregated).map(([key, val]) =>
                    `<b>${columnDisplayNames[selectedXAxis] || selectedXAxis}: ${key}</b><br>Promedio ${columnDisplayNames[selectedYAxis] || selectedYAxis}: ${(val.sum / val.count).toFixed(2)}<br>Partidos: ${val.count}`
                );

                trace.x = aggX;
                trace.y = aggY;
                trace.text = aggText;
            }
        }

        setPlotConfig({
            data: [trace],
            layout: {
                title: {
                    text: `${columnDisplayNames[selectedYAxis] || selectedYAxis} vs ${columnDisplayNames[selectedXAxis] || selectedXAxis}<br><span style="font-size:0.8em; color:grey;">${filterHomeTeam ? `Local: ${filterHomeTeam} ` : ''}${filterAwayTeam ? `Visitante: ${filterAwayTeam} ` : ''}${filterFTR ? `Resultado: ${filterFTR}` : ''}</span>`,
                    xref: 'paper', x: 0.5,
                },
                xaxis: { title: columnDisplayNames[selectedXAxis] || selectedXAxis, automargin: true, type: selectedXAxis === 'Date' ? 'date' : undefined },
                yaxis: { title: columnDisplayNames[selectedYAxis] || selectedYAxis, automargin: true },
                autosize: true,
                height: 600,
                hovermode: 'closest',
                margin: { l: 70, r: 70, b: 120, t: 100, pad: 4 },
                paper_bgcolor: '#f9f9f9',
                plot_bgcolor: '#ffffff',
            }
        });

    }, [filteredData, selectedXAxis, selectedYAxis, selectedChartType, selectedMarkerColor, selectedMarkerSize, columnInfo, filterHomeTeam, filterAwayTeam, filterFTR]);

    useEffect(() => {
        if (filteredData.length > 0 && selectedXAxis && selectedYAxis) {
            generatePlotData();
        } else if (!loading && rawData.length > 0) {
            setPlotConfig({ data: [], layout: { title: 'No hay datos para la selección actual o filtros aplicados.' } });
        }
    }, [generatePlotData, filteredData, selectedXAxis, selectedYAxis, loading, rawData]);

    const renderSelect = (label, value, onChange, options, includeAllOptionText = "Todos") => (
        <div className="control-group">
            <label>{label}:</label>
            <select value={value} onChange={e => onChange(e.target.value)}>
                {includeAllOptionText && <option value="">{includeAllOptionText}</option>}
                {options.map(opt => (
                    <option key={opt} value={opt}>
                        {label.includes("Eje") || label.includes("Marcador") 
                            ? (columnDisplayNames[opt] || opt) // Usar nombre amigable para ejes/marcadores
                            : opt} 
                    </option>
                ))}
            </select>
        </div>
    );

    if (loading) return <div className="loading-container"><div className="spinner"></div><p>Cargando datos...</p></div>;
    if (error) return <div className="error-container"><p>Error: {error}</p></div>;
    if (rawData.length === 0) return <div className="container"><p>No se encontraron datos en el CSV o no se pudieron cargar.</p></div>;

    return (
        <div className="analytics-container">
            <h1 className="main-title">Análisis Interactivo Premier League</h1>
            <div className="controls-panel">
                <div className="controls-row">
                    {renderSelect("Eje X", selectedXAxis, setSelectedXAxis, columnInfo.all, "Selecciona")}
                    {renderSelect("Eje Y", selectedYAxis, setSelectedYAxis, columnInfo.numeric, "Selecciona")}
                    {renderSelect("Tipo de Gráfico", selectedChartType, setSelectedChartType, [
                        { value: 'scatter', label: 'Dispersión' },
                        { value: 'line', label: 'Línea' },
                        { value: 'bar', label: 'Barras' }
                    ].map(opt => opt.value), "Selecciona")} {/* Ahora es un array de objetos */}
                </div>
                <div className="controls-row">
                    {renderSelect("Color Marcador por", selectedMarkerColor, setSelectedMarkerColor, columnInfo.numeric)}
                    {renderSelect("Tamaño Marcador por", selectedMarkerSize, setSelectedMarkerSize, columnInfo.numeric)}
                </div>
                <div className="controls-row">
                    {renderSelect("Filtrar Equipo Local", filterHomeTeam, setFilterHomeTeam, teamNames.home)}
                    {renderSelect("Filtrar Equipo Visitante", filterAwayTeam, setFilterAwayTeam, teamNames.away)}
                    {renderSelect("Filtrar Resultado (FTR)", filterFTR, setFilterFTR, teamNames.ftr.map(ftr => {
                        if (ftr === 'H') return 'H (Local)';
                        if (ftr === 'D') return 'D (Empate)';
                        if (ftr === 'A') return 'A (Visitante)';
                        return ftr;
                    }))} {/* Traducción para FTR */}
                </div>
            </div>

            <div className="chart-container">
                {plotConfig.data && plotConfig.data.length > 0 ? (
                    <Plot
                        data={plotConfig.data}
                        layout={plotConfig.layout}
                        config={{ responsive: true, displaylogo: false, modeBarButtonsToRemove: ['select2d', 'lasso2d'] }}
                        style={{ width: '100%', height: '100%' }}
                        useResizeHandler={true}
                    />
                ) : (
                    <p className="no-data-chart">No hay datos para mostrar con la configuración actual. Intenta ajustar los ejes o filtros.</p>
                )}
            </div>
        </div>
    );
};

export default PremierLeagueAnalytics;