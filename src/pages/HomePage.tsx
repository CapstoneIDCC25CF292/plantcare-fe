import { useEffect, useState } from 'react';
import axios from 'axios';
import UploadArea from '../components/UploadArea';
import { toast } from 'react-toastify';
import { HistoryPredict } from '../models/HistoryPredict';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';

export default function HomePage() {
    const [historyPredicts, setHistoryPredicts] = useState<HistoryPredict[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistoryDetection = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    toast.error("No token available, please login!");
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
            } finally {
                setLoading(false);
            }
        };

        fetchHistoryDetection();
    }, []);

    if (loading) {
        return <div className='flex justify-center items-center h-screen w-full'>Loading...</div>;
    }


    return (
        <div>
            <NavBar />

            <div className='p-5'>
                <div>
                    <div className='font-medium text-3xl'>
                        Welcome back,
                    </div>
                    <div className='text-lg'>
                        Let's check your plant's health today
                    </div>
                </div>

                <UploadArea />

                <div className="mt-5">
                    <div className="text-lg font-medium">Recent Detections</div>

                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {historyPredicts.length !== 0 && historyPredicts.map((historyPredict) => (
                            historyPredict.image && (
                                <Link to={`/history/${historyPredict.id}`} key={historyPredict.id} className="border border-gray-200 rounded-md  overflow-hidden">
                                    <img
                                        src={`data:image/jpeg;base64,${historyPredict.image}`}
                                        alt="Prediction History"
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="flex justify-between items-start p-3">
                                        <div>
                                            <div className="font-semibold capitalize text-lg">
                                                {historyPredict.disease_name.replace(/_/g, ' ')}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {new Date(historyPredict.date_predict).toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                                            {historyPredict.confidence.toFixed(2)}%
                                        </div>
                                    </div>
                                </Link>
                            )
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
