import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

const AuthorityMap = () => {
  const [reportLocations, setReportLocations] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/posts");
      const filtered = response.data.filter(
        (post) =>
          post.type === "report" &&
          post.location &&
          typeof post.location.lat === "number" &&
          typeof post.location.lng === "number" &&
          (post.location.lat !== 0 || post.location.lng !== 0)
      );
      setReportLocations(filtered);
    } catch (error) {
      console.error("Error fetching report data:", error);
    }
  };

  const getCountryName = async (lat, lon) => {
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=en`
      );
      return res.data?.address?.country || "Unknown";
    } catch (err) {
      console.error("Error fetching country name:", err);
      return "Unknown";
    }
  };

  const handleMarkerClick = async (report) => {
    setSelectedReport(report);
    const country = await getCountryName(report.location.lat, report.location.lng);
    setSelectedCountry(country);
  };

  const defaultIcon = L.icon({
    iconUrl: markerIconPng,
    shadowUrl: markerShadowPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  return (
    <div className="p-4 pt-4 flex flex-col lg:flex-row gap-4">
      {/* Map Section */}
      <div className="lg:w-2/3 w-full">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">See Reports Location</h2>
        <div className="rounded-lg overflow-hidden shadow-md border border-gray-200">
          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={5}
            className="h-[450px] w-full z-0"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            <MarkerClusterGroup>
              {reportLocations.map((report, index) => (
                <Marker
                  key={index}
                  position={[report.location.lat, report.location.lng]}
                  icon={defaultIcon}
                  eventHandlers={{
                    click: () => handleMarkerClick(report),
                  }}
                >
                  <Popup>
                    <strong>{report.text || "Pollution Report"}</strong><br />
                    Status: {report.status || "Pending"}
                  </Popup>
                </Marker>
              ))}
            </MarkerClusterGroup>
          </MapContainer>
        </div>
      </div>

      {/* Side Info Panel */}
      <div className="lg:w-1/3 w-full bg-white shadow-md border border-gray-200 rounded-lg p-4 max-h-[450px] overflow-y-auto">
        <h2 className="text-lg font-semibold text-gray-700 text-center mb-3">Report Details</h2>
        {selectedReport ? (
          <div className="space-y-2 text-sm text-gray-700">
            <p><span className="font-medium">Author:</span> {selectedReport.author}</p>
            <p><span className="font-medium">Description:</span> {selectedReport.text}</p>
            <p><span className="font-medium">Coordinates:</span> {selectedReport.location.lat}, {selectedReport.location.lng}</p>
            <p><span className="font-medium">Country:</span> {selectedCountry}</p>
            <p><span className="font-medium">Date:</span> {new Date(selectedReport.createdAt).toLocaleString()}</p>

            {/* Media display */}
            {selectedReport.mediaUrl && (
              <div className="mt-2">
                {selectedReport.mediaUrl.endsWith(".mp4") ? (
                  <video controls className="w-full rounded-md">
                    <source src={selectedReport.mediaUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={selectedReport.mediaUrl}
                    alt="Report media"
                    className="w-full rounded-md"
                  />
                )}
              </div>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-500">Click a marker to view report details.</p>
        )}
      </div>
    </div>
  );
};

export default AuthorityMap;
