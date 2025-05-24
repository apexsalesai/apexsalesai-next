import { FaLock, FaShieldAlt, FaUserSecret } from "react-icons/fa";

const badges = [
  { icon: <FaLock className="text-2xl text-[#00c2cb] mb-2" />, title: "Data Encryption", desc: "End-to-end encryption for all client data." },
  { icon: <FaShieldAlt className="text-2xl text-[#00c2cb] mb-2" />, title: "SOC 2 Compliant", desc: "Enterprise-grade security and compliance." },
  { icon: <FaUserSecret className="text-2xl text-[#00c2cb] mb-2" />, title: "GDPR Ready", desc: "Full compliance with global privacy regulations." }
];

export default function SecuritySection() {
  return (
    <section className="py-16 bg-[#f8fafc] border-b border-gray-100">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-[#0d1321]">Enterprise-Grade Security & Compliance</h2>
        <div className="flex flex-wrap justify-center gap-8 mt-8">
          {badges.map((b, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-lg p-8 max-w-xs text-center border border-gray-100 hover:shadow-xl transition">
              {b.icon}
              <h3 className="font-bold text-lg mb-2 text-[#00c2cb]">{b.title}</h3>
              <p className="text-gray-600">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
