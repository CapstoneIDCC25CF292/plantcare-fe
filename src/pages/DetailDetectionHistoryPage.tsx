import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import NavBar from '../components/NavBar';

type PredictionData = {
    class_name: string;
    confidence: number;
    prediction_time: string;
    image: string;
    next_info: {
        name: string;
        meaning: string;
        suggestion: string[];
    };
};

export default function DetailDetectionHistoryPage() {
    const { id } = useParams();
    const [data, setData] = useState<PredictionData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("No token available, please login!");
                return;
            }

            try {
                const res = await axios.get(`https://plantcare.up.railway.app/api/predict/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setData(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchData();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!data) return <div>No prediction found.</div>;

    return (
        <div>
            <NavBar />

            <div className="p-5 flex flex-col gap-5">
                <div className="flex flex-col md:flex-row gap-5">
                    {data.image && (
                        <img
                            src={`data:image/jpeg;base64,${data.image}`}
                            alt="Prediction"
                            className="w-full md:w-1/2 h-auto rounded-lg object-cover"
                        />
                    )}

                    <div className="flex flex-col gap-5 w-full md:w-1/2">
                        <div className="border rounded-md border-gray-300 p-5">
                            <div className="font-bold mb-2">About the Disease</div>
                            <p className="text-sm text-gray-700">{data.next_info.meaning}</p>
                        </div>

                        <div className="border rounded-md border-gray-300 p-5">
                            <div className="font-bold mb-2">Treatment & Prevention</div>
                            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                                {data.next_info.suggestion.map((sugest, index) => (
                                    <li key={index}>{sugest}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="text-sm text-gray-500">Uploaded on {new Date(data.prediction_time).toLocaleString()}</div>
                <div className="text-3xl font-bold text-gray-800">{data.class_name}</div>

                <div className="flex flex-col gap-2 mt-4 w-full md:w-1/2">
                    <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-700">Confidence Level</span>
                        <span className="text-gray-600">{data.confidence.toFixed(2)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                            className="bg-green-700 h-4 rounded-full transition-all duration-300"
                            style={{ width: `${data.confidence}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
