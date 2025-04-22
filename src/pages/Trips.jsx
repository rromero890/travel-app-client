import { useState, useEffect } from "react";
import axios from "axios";

function Trips() {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [trips, setTrips] = useState([]);
  const [message, setMessage] = useState("");
  const [editingTrip, setEditingTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseURL}/api/trips`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const enrichedTrips = await Promise.all(
        res.data.map(async (trip) => {
          try {
            const city = trip.destination.split(",")[0].trim();
            const weatherRes = await axios.get(
              `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
                city
              )}&appid=fd78a4108bdd053e1a2a1cc5cb42fe7d&units=imperial`
            );

            return {
              ...trip,
              weather: {
                temp: weatherRes.data.main.temp,
                desc: weatherRes.data.weather[0].description,
                icon: weatherRes.data.weather[0].icon,
              },
            };
          } catch (err) {
            console.warn("Weather fetch failed for:", trip.destination);
            return { ...trip, weather: null };
          }
        })
      );

      setTrips(enrichedTrips);
    } catch (err) {
      console.error("Failed to fetch trips:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingTrip
        ? `${baseURL}/api/trips/${editingTrip}`
        : `${baseURL}/api/trips`;

      const method = editingTrip ? "put" : "post";

      await axios[method](
        url,
        { destination, startDate, endDate, notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(editingTrip ? "Trip updated!" : "Trip saved!");
      setEditingTrip(null);
      setDestination("");
      setStartDate("");
      setEndDate("");
      setNotes("");
      fetchTrips();
    } catch (err) {
      setMessage("Something went wrong");
    }
  };

  const handleEdit = (trip) => {
    setEditingTrip(trip._id);
    setDestination(trip.destination);
    setStartDate(trip.startDate);
    setEndDate(trip.endDate);
    setNotes(trip.notes);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseURL}/api/trips/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTrips();
    } catch (err) {
      console.error("Delete failed", err.response?.data || err.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingTrip(null);
    setDestination("");
    setStartDate("");
    setEndDate("");
    setNotes("");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6">
        {editingTrip ? "Edit Trip" : "Plan a New Trip"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
      >
        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
          className="border border-gray-300 rounded px-3 py-2 w-full"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
          className="border border-gray-300 rounded px-3 py-2 w-full"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
          className="border border-gray-300 rounded px-3 py-2 w-full"
        />
        <textarea
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full sm:col-span-2"
        />
        <div className="flex gap-2 sm:col-span-2">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {editingTrip ? "Update Trip" : "Save Trip"}
          </button>
          {editingTrip && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {message && <p className="text-green-600 mb-4">{message}</p>}

      <h3 className="text-xl font-semibold mb-4">My Trips</h3>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-4">
          {trips.map((trip) => (
            <li
              key={trip._id}
              className="p-4 border border-gray-200 rounded shadow-sm"
            >
              <div className="font-medium text-lg text-blue-700">
                {trip.destination}
              </div>
              <div className="text-sm text-gray-600">
                {trip.startDate} to {trip.endDate}
              </div>
              <p className="text-gray-700 my-2">{trip.notes}</p>

              {trip.weather ? (
                <div className="flex items-center gap-2 text-sm mt-2">
                  <img
                    src={`https://openweathermap.org/img/wn/${trip.weather.icon}@2x.png`}
                    alt="weather icon"
                    className="w-8 h-8"
                  />
                  <span>
                    {trip.weather.temp}°F – {trip.weather.desc}
                  </span>
                </div>
              ) : (
                <p className="text-sm text-gray-400 mt-2">
                  No weather info available
                </p>
              )}

              {trip.destination && (
                <div className="mt-4">
                  <iframe
                    title={`map-${trip._id}`}
                    src={`https://www.google.com/maps?q=${encodeURIComponent(
                      trip.destination
                    )}&output=embed`}
                    width="100%"
                    height="200"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              )}

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleEdit(trip)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(trip._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Trips;
