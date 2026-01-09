import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

const PollutionMap = () => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("Fetching address...");
  const [pollutionData, setPollutionData] = useState(null);
  const [error, setError] = useState(null);
  const [notificationSent, setNotificationSent] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        fetchPollutionData(latitude, longitude);
        fetchAddress(latitude, longitude);
      },
      (error) => {
        console.error("Error getting location:", error);
        setError("Unable to fetch location. Please enable GPS.");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );

    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        console.log("Notification Permission:", permission);
      });
    }
  }, []);

  const fetchPollutionData = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://api.waqi.info/feed/geo:${lat};${lng}/?token=8e11a70262b83071c0e417448052f584cf7b1c04`
      );
      if (response.data.status === "ok") {
        setPollutionData(response.data.data);
        if (!notificationSent) {
          sendNotification(response.data.data.aqi);
          setNotificationSent(true);
        }
      } else {
        setError("Failed to fetch pollution data.");
      }
    } catch (error) {
      console.error("Error fetching pollution data:", error);
      setError("Error fetching pollution data.");
    }
  };

  const fetchAddress = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      if (response.data) {
        setAddress(response.data.display_name);
      } else {
        setAddress("Location not found.");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setAddress("Unable to fetch address.");
    }
  };

  const sendNotification = (aqi) => {
    if (Notification.permission === "granted") {
      new Notification("🚨 Pollution Alert!", {
        body: `Air Quality Index: ${aqi} - ${getAQIDescription(aqi)}\nPrecautions: ${getPrecautions(aqi)}`,
        icon: "/pollution-icon.png",
      });
    }
  };

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return "bg-green-500";
    if (aqi <= 100) return "bg-yellow-500";
    if (aqi <= 150) return "bg-orange-500";
    if (aqi <= 200) return "bg-red-500";
    if (aqi <= 300) return "bg-purple-500";
    return "bg-gray-900";
  };

  const getAQIDescription = (aqi) => {
    if (aqi <= 50) return "Good - Air quality is satisfactory.";
    if (aqi <= 100) return "Moderate - Acceptable air quality.";
    if (aqi <= 150) return "Unhealthy for sensitive groups.";
    if (aqi <= 200) return "Unhealthy - Health effects for everyone.";
    if (aqi <= 300) return "Very Unhealthy - Serious health risks.";
    return "Hazardous - Avoid outdoor activities.";
  };

  const getPrecautions = (aqi) => {
    if (aqi <= 50) return "Enjoy your time outside!";
    if (aqi <= 100) return "Sensitive individuals should take care.";
    if (aqi <= 150) return "Consider wearing a mask outdoors.";
    if (aqi <= 200) return "Limit outdoor activities, use a mask.";
    if (aqi <= 300) return "Avoid going outside, use air purifiers.";
    return "Stay indoors and seek medical attention if needed.";
  };

  return (
    <div className="p-4">
      {error && <p className="text-center text-red-500">{error}</p>}
      {location ? (
        <>
          <p className="text-center font-semibold">
            📍 Current Location: <span className="text-blue-600">{address}</span>
          </p>
          <p className="text-center text-gray-600">
            Latitude: {location.lat}, Longitude: {location.lng}
          </p>
          <MapContainer
            center={[location.lat, location.lng]}
            zoom={13}
            className="h-96 w-full rounded-lg shadow-lg mt-2"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker
              position={[location.lat, location.lng]}
              icon={L.icon({
                iconUrl: markerIconPng,
                shadowUrl: markerShadowPng,
                iconSize: [25, 41],
                iconAnchor: [12, 41],
              })}
            >
              <Popup>Your Location</Popup>
            </Marker>
          </MapContainer>
        </>
      ) : (
        <p className="text-center">Fetching location...</p>
      )}
      {pollutionData && (
        <div className={`mt-4 p-4 text-white text-center rounded-lg shadow-md ${getAQIColor(pollutionData.aqi)}`}>
          <h3 className="text-xl font-semibold">Air Quality Index: {pollutionData.aqi}</h3>
          <p>{getAQIDescription(pollutionData.aqi)}</p>
          <p className="mt-2 font-bold">Precautions: {getPrecautions(pollutionData.aqi)}</p>
        </div>
      )}
    </div>
  );
};

export default PollutionMap;
