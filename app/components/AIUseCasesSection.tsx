import { FaRobot, FaChartLine, FaHandshake, FaComments } from "react-icons/fa";

const useCases = [
  { icon: <FaRobot className="text-3xl text-[#00c2cb] mb-2" />, title: "Autonomous Lead Nurturing", desc: "AI agents engage, qualify, and nurture leads 24/7, ensuring no opportunity slips through the cracks." },
  { icon: <FaChartLine className="text-3xl text-[#00c2cb] mb-2" />, title: "Predictive Revenue Forecasting", desc: "Real-time forecasting and pipeline insights powered by machine learning." },
  { icon: <FaHandshake className="text-3xl text-[#00c2cb] mb-2" />, title: "Customer Retention Automation", desc: "Proactively identify churn risks and trigger retention campaigns autonomously." },
  { icon: <FaComments className="text-3xl text-[#00c2cb] mb-2" />, title: "Conversational AI Support", desc: "Automated, human-like support for prospects and customers at every stage." },
];

export default function AIUseCasesSection() {
  return (
    <section className="py-20 bg-[#f8fafc] border-b border-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-[#0d1321] text-center">AI Agent Use Cases</h2>
        <div className="grid md:grid-cols-4 gap-8 mt-8">
          {useCases.map((uc, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-100 hover:shadow-xl transition">
              {uc.icon}
              <h3 className="font-bold text-lg mb-2 text-[#00c2cb]">{uc.title}</h3>
              <p className="text-gray-600">{uc.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
