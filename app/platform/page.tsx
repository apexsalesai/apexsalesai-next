import Link from 'next/link';
import DashboardTabs from '../components/DashboardTabs';

export default function Platform() {
  return (
    <>
      <section className="pt-20 pb-16 relative text-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 left-1/4 w-[30vw] h-[30vw] rounded-full bg-[#00c2cb] opacity-10 filter blur-[100px] z-0"></div>
          <div className="absolute top-1/2 right-1/4 w-[25vw] h-[25vw] rounded-full bg-[#005f6b] opacity-10 filter blur-[80px] z-0"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">AI Agents for Every Team. Results for Every Industry.</h1>
          <p className="text-xl text-[#00c2cb] font-semibold max-w-3xl mx-auto mb-6">
            ApexSalesAI empowers your entire organization—from sales to support, operations to innovation—to move faster, serve smarter, and unlock new growth in every interaction.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/demo" 
              className="bg-[#00c2cb] text-[#0d1321] font-bold py-3 px-6 rounded-lg hover:bg-[#00a8b3] transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl"
            >
              Schedule a Demo
            </Link>
            <Link 
              href="#platform-details" 
              className="bg-[#00c2cb] text-[#0d1321] font-bold py-3 px-6 rounded-lg hover:bg-[#00a8b3] transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl"
            >
              Explore Features
            </Link>
          </div>
        </div>
      </section>

      <section id="platform-details" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">What Powers ApexSalesAI?</h2>
          <p className="text-[#cbd5e0] mb-12 text-center max-w-3xl mx-auto">
            Our proprietary ApexOpsAI engine combines the latest in machine learning, natural language processing, and decision intelligence to create autonomous agents that transform how teams sell and support.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#1a202c] p-6 rounded-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <h3 className="text-xl font-bold mb-3">Contextual Intelligence</h3>
              <p className="text-[#cbd5e0]">
                Our agents understand nuanced business conversations, detecting intent and sentiment to provide personalized interactions at scale.
              </p>
            </div>
            <div className="bg-[#1a202c] p-6 rounded-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <h3 className="text-xl font-bold mb-3">Autonomous Workflow</h3>
              <p className="text-[#cbd5e0]">
                From initial contact to deal closure, our AI can independently manage entire workflows while knowing when to engage human experts.
              </p>
            </div>
            <div className="bg-[#1a202c] p-6 rounded-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <h3 className="text-xl font-bold mb-3">Enterprise Integration</h3>
              <p className="text-[#cbd5e0]">
                Seamlessly connects with your existing tech stack including CRM, email, knowledge bases, and communication platforms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Demo Section */}
      <section className="py-16 bg-[#0d1321]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">See ApexSalesAI in Action</h2>
          <div className="max-w-6xl mx-auto">
            <DashboardTabs />
          </div>
        </div>
      </section>

      <section id="sales" className="py-16 bg-[#1a202c]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">ApexSalesAI Agents</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#0d1321] p-6 rounded-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl h-full flex flex-col">
              <h3 className="text-xl font-bold mb-3">Lead Generation</h3>
              <p className="text-[#cbd5e0] mb-6">
                AI-powered prospecting that identifies high-intent buyers before competitors can reach them.
              </p>
              <ul className="list-disc list-inside text-[#cbd5e0] mb-6 flex-grow">
                <li>Intelligent lead scoring</li>
                <li>Buying signal detection</li>
                <li>Automated outreach sequences</li>
                <li>Multi-channel engagement</li>
              </ul>
            </div>
            <div className="bg-[#0d1321] p-6 rounded-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl h-full flex flex-col">
              <h3 className="text-xl font-bold mb-3">Deal Intelligence</h3>
              <p className="text-[#cbd5e0] mb-6">
                Transform your pipeline with AI that predicts outcomes and prescribes winning actions.
              </p>
              <ul className="list-disc list-inside text-[#cbd5e0] mb-6 flex-grow">
                <li>Win probability forecasting</li>
                <li>Deal risk monitoring</li>
                <li>Competitive intelligence</li>
                <li>Next-best-action guidance</li>
              </ul>
            </div>
            <div className="bg-[#0d1321] p-6 rounded-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl h-full flex flex-col">
              <h3 className="text-xl font-bold mb-3">Sales Automation</h3>
              <p className="text-[#cbd5e0] mb-6">
                24/7 smart prospecting, automated outreach, real-time CRM updates — so your sales team can focus on closing deals, not chasing tasks.
              </p>
              <ul className="list-disc list-inside text-[#cbd5e0] mb-6 flex-grow">
                <li>Meeting scheduling</li>
                <li>Follow-up management</li>
                <li>Administrative task elimination</li>
                <li>Performance analytics</li>
              </ul>
            </div>
          </div>
          <div className="text-center mt-10">
            <Link 
              href="/demo" 
              className="bg-[#00c2cb] text-[#0d1321] font-bold py-3 px-6 rounded-lg hover:bg-[#00a8b3] transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl"
            >
              Schedule a Sales Demo
            </Link>
          </div>
        </div>
      </section>

      <section id="support" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">ApexSupportAI Agents</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#1a202c] p-6 rounded-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl h-full flex flex-col">
              <h3 className="text-xl font-bold mb-3">Customer Resolution</h3>
              <p className="text-[#cbd5e0] mb-6">
                Provide instant, accurate responses to customer inquiries with contextual understanding.
              </p>
              <ul className="list-disc list-inside text-[#cbd5e0] mb-6 flex-grow">
                <li>24/7 support availability</li>
                <li>Natural language understanding</li>
                <li>Multi-language support</li>
                <li>Contextual memory</li>
              </ul>
            </div>
            <div className="bg-[#1a202c] p-6 rounded-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl h-full flex flex-col">
              <h3 className="text-xl font-bold mb-3">Knowledge Operations</h3>
              <p className="text-[#cbd5e0] mb-6">
                Leverage your existing knowledge base with AI that learns and improves over time.
              </p>
              <ul className="list-disc list-inside text-[#cbd5e0] mb-6 flex-grow">
                <li>Automatic knowledge indexing</li>
                <li>Content gap analysis</li>
                <li>Self-learning capabilities</li>
                <li>Knowledge suggestion engine</li>
              </ul>
            </div>
            <div className="bg-[#1a202c] p-6 rounded-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl h-full flex flex-col">
              <h3 className="text-xl font-bold mb-3">Ticket Management</h3>
              <p className="text-[#cbd5e0] mb-6">
                Intelligent routing, prioritization, and resolution tracking for unprecedented efficiency.
              </p>
              <ul className="list-disc list-inside text-[#cbd5e0] mb-6 flex-grow">
                <li>Smart escalation protocols</li>
                <li>SLA compliance monitoring</li>
                <li>Automated follow-ups</li>
                <li>CSAT & NPS optimization</li>
              </ul>
            </div>
          </div>
          <div className="text-center mt-10">
            <Link 
              href="/demo" 
              className="bg-[#00c2cb] text-[#0d1321] font-bold py-3 px-6 rounded-lg hover:bg-[#00a8b3] transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl"
            >
              Schedule a Support Demo
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#1a202c]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Enterprise-Grade Integration</h2>
          <p className="text-[#cbd5e0] mb-12 max-w-3xl mx-auto">
            ApexSalesAI seamlessly connects with your existing technology ecosystem, requiring minimal IT resources while providing maximum security.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#0d1321] p-6 rounded-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <h3 className="text-xl font-bold mb-3">CRM Integration</h3>
              <p className="text-[#cbd5e0]">
                Native connections with Salesforce, HubSpot, Microsoft Dynamics, and other leading CRMs with bi-directional data flow.
              </p>
            </div>
            <div className="bg-[#0d1321] p-6 rounded-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <h3 className="text-xl font-bold mb-3">Communication Stack</h3>
              <p className="text-[#cbd5e0]">
                Works with your email (Gmail, Outlook), messaging (Slack, Teams), and telephony systems for omnichannel engagement.
              </p>
            </div>
            <div className="bg-[#0d1321] p-6 rounded-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <h3 className="text-xl font-bold mb-3">Security & Compliance</h3>
              <p className="text-[#cbd5e0]">
                SOC 2 Type II certified, GDPR compliant, and equipped with enterprise-grade data encryption and access controls.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 text-center bg-[#091018]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">From Pipeline to Profit—Let AI Do the Heavy Lifting.</h2>
          <p className="text-xl text-[#9ca3af] mb-8 max-w-3xl mx-auto">
            Book a personalized demo to see how ApexSalesAI can help your team automate, optimize, and win more—across every department.
          </p>
          <Link 
            href="/demo" 
            className="bg-[#00c2cb] text-[#0d1321] font-bold py-3 px-6 rounded-lg hover:bg-[#00a8b3] transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl"
          >
            Schedule Your Demo
          </Link>
        </div>
      </section>
    </>
  );
}
