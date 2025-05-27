import { useEffect, useState } from 'react'
import { HistoryPredict } from '../models/HistoryPredict';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';

export default function DetectionHistoryPage() {
    const [historyPredicts, setHistoryPredicts] = useState<HistoryPredict[]>([]);

    useEffect(() => {

        const fetchHistoryDetection = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    toast.error("No token available, please login again!");
                    return;
                }

                const response = await axios.get("https://plantcare.up.railway.app/api/predict", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setHistoryPredicts(response.data.data);
            } catch (err: any) {
                toast.error(err.response?.data?.message || "Failed to fetch user.");
            }
        };

        fetchHistoryDetection();
    }, [])


    return (
        <div>
            <NavBar />
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {historyPredicts.length !== 0 && historyPredicts.map((historyPredict) => (
                    historyPredict.image && (
                        <Link
                            to={`/history/${historyPredict.id}`}
                            key={historyPredict.id}
                            className="flex flex-col md:flex-row border border-gray-200 rounded-md overflow-hidden shadow-md hover:shadow-lg transition duration-200"
                        >
                            {/* Image Section */}
                            <img
                                src={`data:image/jpeg;base64,${historyPredict.image}`}
                                alt="Prediction History"
                                className="w-full md:w-56 h-56 object-cover"
                            />

                            {/* Text Content Section */}
                            <div className="flex flex-col justify-between p-4 w-full">
                                {/* Disease Name & Description */}
                                <div>
                                    <div className="font-semibold capitalize text-lg text-gray-800">
                                        {historyPredict.disease_name.replace(/_/g, ' ')}
                                    </div>
                                    <div className="line-clamp-3 text-gray-700 text-sm mt-2">
                                        {historyPredict.description}
                                    </div>
                                </div>

                                {/* Confidence Level Section */}
                                <div className="mt-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="text-sm font-medium text-gray-700">Confidence Level</div>
                                        <div className="text-sm text-gray-600 mt-1">
                                            {historyPredict.confidence.toFixed(2)}%
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-4">
                                        <div
                                            className="bg-[#2E7D32] h-4 rounded-full transition-all duration-300"
                                            style={{ width: `${historyPredict.confidence}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Date & View Details */}
                                <div className='flex justify-between w-full mt-4 text-sm text-gray-600'>
                                    <div>{new Date(historyPredict.date_predict).toLocaleString()}</div>
                                    <div className='text-[#2E7D32] font-medium'>View Details</div>
                                </div>
                            </div>
                        </Link>
                    )
                ))}
            </div>
        </div>
    )
}
