import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Schedule a Demo | ApexSalesAI",
  description:
    "See how ApexSalesAI's AI agents Max and Mia accelerate your enterprise sales pipeline. Schedule a personalized demo with our team.",
  openGraph: {
    title: "Schedule a Demo | ApexSalesAI",
    description:
      "See how ApexSalesAI's AI agents Max and Mia accelerate your enterprise sales pipeline.",
    url: "https://apexsalesai.com/demo",
    siteName: "ApexSalesAI",
    locale: "en_US",
    type: "website",
  },
};

export default function DemoPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#0d1321] to-[#1a202c] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            See ApexSalesAI in Action
          </h1>
          <p className="text-xl text-[#cbd5e0] mb-8 max-w-2xl mx-auto">
            Watch how AI agents Max and Mia generate personalized content across
            6+ channels, integrate natively with Microsoft Dataverse, and
            accelerate your enterprise sales pipeline.
          </p>
        </div>
      </section>

      {/* What You Will See */}
      <section className="py-16 px-4 bg-[#1a202c]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            What You Will See in Your Demo
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-[#0d1321] rounded-xl border border-[#2d3748]">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-3 text-white">
                AI Agent Orchestration
              </h3>
              <p className="text-[#a0aec0]">
                Max handles multi-channel outreach while Mia creates targeted
                content. See autonomous agents working together in real time.
              </p>
            </div>
            <div className="text-center p-6 bg-[#0d1321] rounded-xl border border-[#2d3748]">
              <div className="text-4xl mb-4">🔗</div>
              <h3 className="text-xl font-semibold mb-3 text-white">
                Microsoft Integration
              </h3>
              <p className="text-[#a0aec0]">
                Native Dataverse sync, Power Platform workflows, Teams
                notifications, and Outlook integration. No middleware required.
              </p>
            </div>
            <div className="text-center p-6 bg-[#0d1321] rounded-xl border border-[#2d3748]">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-3 text-white">
                Pipeline Acceleration
              </h3>
              <p className="text-[#a0aec0]">
                From prospect identification to personalized outreach across
                email, LinkedIn, Twitter, SMS, voice, and web channels.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact/Booking Section */}
      <section className="py-16 px-4 bg-[#0d1321]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">
            Schedule Your Personalized Demo
          </h2>
          <p className="text-lg text-[#cbd5e0] mb-8">
            Get a 30-minute walkthrough tailored to your sales team's workflow.
            See exactly how ApexSalesAI fits into your existing Microsoft
            ecosystem.
          </p>
          <div className="bg-[#1a202c] rounded-xl shadow-lg p-8 border border-[#2d3748]">
            <a
              href="mailto:tim@apexsalesai.com?subject=Demo%20Request%20-%20ApexSalesAI&body=Hi%20Tim%2C%0A%0AI'd%20like%20to%20schedule%20a%20demo%20of%20ApexSalesAI.%0A%0ACompany%3A%20%0ARole%3A%20%0ATeam%20Size%3A%20%0ACurrent%20CRM%3A%20%0A%0ABest%20times%20for%20a%2030-minute%20call%3A%20"
              className="inline-block bg-[#00c2cb] hover:bg-[#00a8b3] text-[#0d1321] font-semibold py-4 px-8 rounded-lg text-lg transition-colors duration-200"
            >
              Request a Demo
            </a>
            <p className="text-sm text-[#a0aec0] mt-4">
              Typically responds within 4 business hours
            </p>
          </div>
          <div className="mt-8 flex justify-center gap-8 text-sm text-[#a0aec0]">
            <span>30 minutes</span>
            <span>|</span>
            <span>Personalized to your workflow</span>
            <span>|</span>
            <span>No commitment required</span>
          </div>
        </div>
      </section>
    </div>
  );
}
