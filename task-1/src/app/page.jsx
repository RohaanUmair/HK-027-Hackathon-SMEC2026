'use client';
import { useState } from "react";

const pkCities = [
    { name: "Karachi", lat: 24.8607, lon: 67.0011 },
    { name: "Lahore", lat: 31.5204, lon: 74.3587 },
    { name: "Faisalabad", lat: 31.4504, lon: 73.1350 },
    { name: "Rawalpindi", lat: 33.5651, lon: 73.0169 },
    { name: "Gujranwala", lat: 32.1877, lon: 74.1945 },
    { name: "Peshawar", lat: 34.0151, lon: 71.5249 },
    { name: "Multan", lat: 30.1575, lon: 71.5249 },
    { name: "Hyderabad", lat: 25.3960, lon: 68.3578 },
    { name: "Islamabad", lat: 33.6844, lon: 73.0479 },
    { name: "Quetta", lat: 30.1798, lon: 66.9750 },
    { name: "Bahawalpur", lat: 29.3544, lon: 71.6911 },
    { name: "Sargodha", lat: 32.0836, lon: 72.6711 },
    { name: "Sialkot", lat: 32.4945, lon: 74.5229 },
    { name: "Sukkur", lat: 27.7244, lon: 68.8475 },
    { name: "Larkana", lat: 27.5570, lon: 68.2028 },
    { name: "Sheikhupura", lat: 31.7131, lon: 73.9783 },
    { name: "Rahim Yar Khan", lat: 28.4211, lon: 70.2989 },
    { name: "Jhang", lat: 31.2781, lon: 72.3317 },
    { name: "Dera Ghazi Khan", lat: 30.0489, lon: 70.6355 },
    { name: "Gujrat", lat: 32.5742, lon: 74.0754 },
    { name: "Sahiwal", lat: 30.6682, lon: 73.1114 },
    { name: "Wah Cantonment", lat: 33.7630, lon: 72.7530 },
    { name: "Mardan", lat: 34.1989, lon: 72.0314 },
    { name: "Kasur", lat: 31.1179, lon: 74.4461 },
    { name: "Okara", lat: 30.8100, lon: 73.4595 },
    { name: "Mingora", lat: 34.7717, lon: 72.3602 },
    { name: "Nawabshah", lat: 26.2483, lon: 68.4096 },
    { name: "Chiniot", lat: 31.7200, lon: 72.9789 },
    { name: "Kotli", lat: 33.5150, lon: 73.9011 },
    { name: "Mirpur", lat: 33.1431, lon: 73.7541 },
    { name: "Muzaffarabad", lat: 34.3700, lon: 73.4708 },
    { name: "Gilgit", lat: 35.9208, lon: 74.3083 },
    { name: "Gwadar", lat: 25.1216, lon: 62.3254 },
    { name: "Skardu", lat: 35.2985, lon: 75.6333 },
    { name: "Chaman", lat: 30.9177, lon: 66.4461 }
];

const qualitativeData = [
    { name: 'Good', index: 1, so2: '[0; 20)', no2: '[0; 40)', pm10: '[0; 20)', pm25: '[0; 10)', o3: '[0; 60)', co: '[0; 4400)', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { name: 'Fair', index: 2, so2: '[20; 80)', no2: '[40; 70)', pm10: '[20; 50)', pm25: '[10; 25)', o3: '[60; 100)', co: '[4400; 9400)', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    { name: 'Moderate', index: 3, so2: '[80; 250)', no2: '[70; 150)', pm10: '[50; 100)', pm25: '[25; 50)', o3: '[100; 140)', co: '[9400-12400)', color: 'bg-orange-50 text-orange-700 border-orange-200' },
    { name: 'Poor', index: 4, so2: '[250; 350)', no2: '[150; 200)', pm10: '[100; 200)', pm25: '[50; 75)', o3: '[140; 180)', co: '[12400; 15400)', color: 'bg-red-50 text-red-700 border-red-200' },
    { name: 'Very Poor', index: 5, so2: '≥350', no2: '≥200', pm10: '≥200', pm25: '≥75', o3: '≥180', co: '≥15400', color: 'bg-purple-50 text-purple-700 border-purple-200' },
];

export default function Page2() {
    const API_KEY = '57c21ed1f8c600c752d42bca2d9ef5fb';

    const [apiData, setApiData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [city, setCity] = useState(pkCities[0].name);
    const [displayedCity, setDisplayedCity] = useState('');
    const [lat, setLat] = useState(pkCities[0].lat);
    const [lon, setLon] = useState(pkCities[0].lon);

    const handleSubmit = async (e) => {
        e.preventDefault();
        fetchAirQuality(lat, lon, city);
    }

    const fetchAirQuality = async (latitude, longitude, cityName) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const result = await response.json();
            setApiData(result.list[0]);
            setDisplayedCity(cityName);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            return;
        }

        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchAirQuality(latitude, longitude, "Detected Location");
            },
            (err) => {
                setError("Unable to retrieve your location. Please check permissions.");
                setLoading(false);
            }
        );
    }

    const currentAqi = apiData?.main?.aqi;

    return (
        <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-900">
            <div className="max-w-6xl mx-auto space-y-10">

                <div className="text-center">
                    <h1 className="text-4xl font-bold">Air Quality Monitor</h1>
                    <p className="text-slate-500 mt-2">Check real-time air pollution data for cities in Pakistan.</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Select a City</label>
                            <select
                                value={city}
                                onChange={(e) => {
                                    const selected = pkCities.find((c) => c.name === e.target.value);
                                    setCity(selected.name);
                                    setLat(selected.lat);
                                    setLon(selected.lon);
                                }}
                                className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {pkCities.map((item) => (
                                    <option key={item.name} value={item.name}>{item.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex gap-2 mt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 disabled:bg-blue-300"
                            >
                                {loading ? 'Loading...' : 'Check Now'}
                            </button>
                            <button
                                type="button"
                                onClick={handleDetectLocation}
                                disabled={loading}
                                className="flex-1 bg-slate-100 text-slate-700 px-6 py-2 rounded-lg font-bold hover:bg-slate-200 disabled:opacity-50"
                            >
                                Detect Location
                            </button>
                        </div>
                    </form>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </div>

                {apiData && (
                    <div className={`p-6 rounded-xl border ${qualitativeData[currentAqi - 1]?.color}`}>
                        <h2 className="text-xl font-bold">{displayedCity} Results</h2>
                        <p className="text-2xl font-black mt-1">
                            {qualitativeData[currentAqi - 1]?.name} (Level {currentAqi})
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 mt-6">
                            <div className="bg-white/50 p-3 rounded-lg text-center">
                                <p className="text-xs font-bold uppercase opacity-70">SO2</p>
                                <p className="text-lg font-bold">{apiData.components.so2}</p>
                            </div>
                            <div className="bg-white/50 p-3 rounded-lg text-center">
                                <p className="text-xs font-bold uppercase opacity-70">NO2</p>
                                <p className="text-lg font-bold">{apiData.components.no2}</p>
                            </div>
                            <div className="bg-white/50 p-3 rounded-lg text-center">
                                <p className="text-xs font-bold uppercase opacity-70">PM10</p>
                                <p className="text-lg font-bold">{apiData.components.pm10}</p>
                            </div>
                            <div className="bg-white/50 p-3 rounded-lg text-center">
                                <p className="text-xs font-bold uppercase opacity-70">PM2.5</p>
                                <p className="text-lg font-bold">{apiData.components.pm2_5}</p>
                            </div>
                            <div className="bg-white/50 p-3 rounded-lg text-center">
                                <p className="text-xs font-bold uppercase opacity-70">O3</p>
                                <p className="text-lg font-bold">{apiData.components.o3}</p>
                            </div>
                            <div className="bg-white/50 p-3 rounded-lg text-center">
                                <p className="text-xs font-bold uppercase opacity-70">CO</p>
                                <p className="text-lg font-bold">{apiData.components.co}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
                    <div className="p-4 bg-slate-100 border-b border-slate-200">
                        <h3 className="font-bold">Air Quality Standards</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="bg-slate-50">
                                    <th className="p-4 border-b">Name</th>
                                    <th className="p-4 border-b">Index</th>
                                    <th className="p-4 border-b">SO2</th>
                                    <th className="p-4 border-b">NO2</th>
                                    <th className="p-4 border-b">PM10</th>
                                    <th className="p-4 border-b">PM2.5</th>
                                    <th className="p-4 border-b">O3</th>
                                    <th className="p-4 border-b">CO</th>
                                </tr>
                            </thead>
                            <tbody>
                                {qualitativeData.map((row) => (
                                    <tr key={row.index} className={currentAqi === row.index ? row.color : "hover:bg-slate-50"}>
                                        <td className="p-4 font-bold">{row.name}</td>
                                        <td className="p-4">{row.index}</td>
                                        <td className="p-4">{row.so2}</td>
                                        <td className="p-4">{row.no2}</td>
                                        <td className="p-4">{row.pm10}</td>
                                        <td className="p-4">{row.pm25}</td>
                                        <td className="p-4">{row.o3}</td>
                                        <td className="p-4">{row.co}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}