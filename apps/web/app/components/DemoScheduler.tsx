import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarIcon, ClockIcon, UserIcon, PhoneIcon } from '@heroicons/react/24/outline';

interface TimeSlot {
  time: string;
  available: boolean;
}

const timeSlots: TimeSlot[] = [
  { time: '10:00 AM', available: true },
  { time: '11:00 AM', available: true },
  { time: '1:00 PM', available: true },
  { time: '2:00 PM', available: true },
  { time: '3:00 PM', available: true },
];

const DemoScheduler: React.FC = () => {
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    setSubmitted(true);
  };

  return (
    <div className="bg-[#0d1321] rounded-2xl p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-white mb-4">
          Schedule a Personalized Demo
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Experience the power of ApexSalesAI with a customized demo tailored to your business needs.
        </p>
      </motion.div>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <UserIcon className="w-5 h-5 inline-block mr-2" />
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-[#1a1e29] rounded-lg border border-[#2d3748] focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/50 text-white placeholder-gray-400"
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <PhoneIcon className="w-5 h-5 inline-block mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 bg-[#1a1e29] rounded-lg border border-[#2d3748] focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/50 text-white placeholder-gray-400"
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <ClockIcon className="w-5 h-5 inline-block mr-2" />
                Preferred Time
              </label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full px-4 py-3 bg-[#1a1e29] rounded-lg border border-[#2d3748] focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/50 text-white"
                required
              >
                <option value="">Select a time</option>
                {timeSlots.map((slot) => (
                  <option
                    key={slot.time}
                    value={slot.time}
                    disabled={!slot.available}
                  >
                    {slot.time} {slot.available ? '' : '(Booked)'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <CalendarIcon className="w-5 h-5 inline-block mr-2" />
                Company Name
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-4 py-3 bg-[#1a1e29] rounded-lg border border-[#2d3748] focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/50 text-white placeholder-gray-400"
                placeholder="Enter your company name"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#0ea5e9] text-white font-semibold py-4 px-8 rounded-lg hover:bg-[#0284c7] transition-colors duration-200"
          >
            Schedule Demo
          </button>
        </form>
      ) : (
        <div className="text-center">
          <div className="text-4xl text-[#0ea5e9] mb-4">✓</div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Demo Scheduled Successfully!
          </h3>
          <p className="text-gray-400">
            We'll send you a confirmation email shortly. One of our sales experts will reach out to confirm your demo details.
          </p>
        </div>
      )}
    </div>
  );
};

export default DemoScheduler;
