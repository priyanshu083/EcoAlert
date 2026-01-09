import { motion } from "framer-motion";
import { FaLeaf, FaMapMarkedAlt, FaUsers, FaChartLine } from "react-icons/fa";

const LandingPage = () => {
  return (
    <div className="min-hdata-screen bg-gradient-to-b from-green-600 to-white text-white">
      <section className="text-center py-20 px-6">
        <motion.h1
          className="text-5xl font-extrabold text-white mb-6"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Take Action for a Cleaner Planet
        </motion.h1>
        <p className="text-lg font-bold text-gray-200 mb-6 max-w-xl mx-auto">
          Report pollution, support green initiatives, and connect with a community working towards environmental change.
        </p>
        <div className="max-w-xl mx-auto">
          <img
            src='/assets/planting.jpg'
            alt="Eco friendly illustration"
            className="rounded-2xl shadow-lg w-full"
          />
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 p-10 text-black">
        <FeatureCard icon={<FaLeaf />} title="Report Pollution" desc="Spot pollution? Report it instantly with images and details." />
        <FeatureCard icon={<FaMapMarkedAlt />} title="Interactive Map" desc="See real-time pollution data and affected areas." />
        <FeatureCard icon={<FaChartLine />} title="Crowdfund Initiatives" desc="Support or start eco-friendly projects for change." />
      </section>

      <section className="px-6 py-12 bg-white text-black">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-green-700">Why EcoAlert?</h2>
            <p className="text-gray-700 mb-4">
              EcoAlert empowers citizens to be the voice of the environment. With a simple interface and impactful tools,
              users can report environmental hazards, track local air quality, and fund green initiatives directly from their devices.
            </p>
            <p className="text-gray-700">
              Whether you’re an environmentalist, a student, or just someone who cares, EcoAlert helps turn concern into action.
            </p>
          </div>
          <div>
            <img
              src='/assets/cleaning.jpg'
              alt="Save Earth"
              className="rounded-2xl shadow-lg w-full"
            />
          </div>
        </div>
      </section>

      <footer className="bg-green-700 text-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-6 text-center md:text-left">
          <div>
            <h4 className="text-xl font-bold mb-2">EcoAlert</h4>
            <p className="text-sm text-gray-200">
              Your companion in environmental protection. Act, report, and fund change around you.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2">Quick Links</h4>
            <ul className="text-sm space-y-1">
              <li><a href="/" className="hover:underline">Home</a></li>
              <li><a href="/map" className="hover:underline">Map</a></li>
              <li><a href="/community" className="hover:underline">Community</a></li>
              <li><a href="/crowdfunding" className="hover:underline">Crowdfunding</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2">Contact Us</h4>
            <a href="mailto:ecoalert.team@gmail.com" className="text-sm">ecoalert.team@gmail.com</a>
          </div>
        </div>
        <div className="text-center text-sm text-gray-300 mt-6">
          &copy; {new Date().getFullYear()} EcoAlert. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <motion.div
    className="p-6 bg-white rounded-2xl shadow-lg text-center transform hover:scale-105 transition-all"
    whileHover={{ scale: 1.05 }}
  >
    <div className="text-green-600 text-4xl mb-3">{icon}</div>
    <h3 className="font-bold text-xl mb-2">{title}</h3>
    <p className="text-gray-600">{desc}</p>
  </motion.div>
);

export default LandingPage;
