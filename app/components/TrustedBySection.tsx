import Image from "next/image";

const logos = [
  { src: "/images/logo-microsoft.png", alt: "Microsoft" },
  { src: "/images/logo-aws.png", alt: "Amazon Web Services" },
  { src: "/images/logo-salesforce.png", alt: "Salesforce" },
  { src: "/images/logo-cisco.png", alt: "Cisco" },
  { src: "/images/logo-googlecloud.png", alt: "Google Cloud" },
  { src: "/images/logo-ibm.png", alt: "IBM" }
];

export default function TrustedBySection() {
  return (
    <section className="py-10 bg-white/70 border-b border-gray-100">
      <div className="container mx-auto px-4 text-center">
        <div className="mb-6 text-sm font-semibold uppercase tracking-wider text-gray-600">Trusted by innovative enterprises</div>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {logos.map((logo, idx) => (
            <div key={idx} className="opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition">
              <Image src={logo.src} alt={logo.alt} width={120} height={40} style={{width:'auto',height:'40px'}} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

