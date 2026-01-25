import Image from "next/image";

const integrations = [
  { src: "/images/logo-microsoft.png", alt: "Microsoft" },
  { src: "/images/logo-aws.png", alt: "Amazon Web Services" },
  { src: "/images/logo-salesforce.png", alt: "Salesforce" },
  { src: "/images/logo-cisco.png", alt: "Cisco" },
  { src: "/images/logo-googlecloud.png", alt: "Google Cloud" },
  { src: "/images/logo-ibm.png", alt: "IBM" }
];

export default function IntegrationsSection() {
  return (
    <section className="py-16 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-[#0d1321]">Seamless Integrations</h2>
        <p className="text-gray-600 mb-8">Connect ApexSalesAI with your favorite tools and platforms.</p>
        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
          {integrations.map((i, idx) => (
            <div key={idx} className="opacity-80 grayscale hover:grayscale-0 hover:opacity-100 transition">
              <Image src={i.src} alt={i.alt} width={80} height={40} style={{width:'auto',height:'40px'}} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
