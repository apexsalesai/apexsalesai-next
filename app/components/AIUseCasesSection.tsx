'use client';
import { useState } from "react";
import { FaRobot } from "react-icons/fa";

const useCases = [ // <-- open array
  {
    icon: "/images/ai-revenue.svg",
    label: "Fast-Track Revenue Solutions",
    summary: "Jumpstart your sales with rapid AI audits, agent bundles, and scalable SaaS plans. Generate revenue in days, not months.",
    stats: [
      { value: "$1,500+", label: "Audit Fee" },
      { value: "$2.5k+", label: "Agent Bundle" }
    ],
    details: (
      <div className="text-left">
        <h4 className="font-bold text-xl mb-2 text-[#00c2cb]">Fast-Track Revenue: Apex Quickstart Offers</h4>
        <p className="mb-4">Get revenue flowing fast with these proven, high-impact solutions. Perfect for businesses who want results now while building for the future.</p>
        <div className="mb-6">
          <h5 className="font-semibold text-[#0d1321] mb-1">1. AI Audit + Revamp Package</h5>
          <ul className="list-disc ml-6 mb-2">
            <li><b>Offer:</b> "In 72 hours, we’ll audit your sales stack and deploy an Apex AI Agent that closes gaps."</li>
            <li><b>Price:</b> $1,500+ per audit</li>
            <li><b>Deployment:</b> $5k–$20k per agent + consulting</li>
            <li><b>How it works:</b> Discovery call, templated playbook, rapid deployment, repeatable & scalable.</li>
          </ul>
          <a href="/demo" className="inline-block bg-[#00c2cb] text-white font-bold px-6 py-2 rounded-full shadow hover:bg-[#00e0e6] transition">Book Your Audit</a>
        </div>
        <div className="mb-6">
          <h5 className="font-semibold text-[#0d1321] mb-1">2. Website + AI Sales Agent Bundle</h5>
          <ul className="list-disc ml-6 mb-2">
            <li><b>Offer:</b> “Enterprise Website + Live AI SDR Agent in 14 Days”</li>
            <li><b>Target:</b> SMBs, real estate, agencies, SaaS startups</li>
            <li><b>Stack:</b> Vercel + Next.js + Max agent preinstalled</li>
            <li><b>Price:</b> $2,500–$7,500 per deployment</li>
            <li><b>Margin:</b> 70%+ (prebuilt templates, light customizations)</li>
          </ul>
          <a href="/contact" className="inline-block bg-[#0d1321] text-white font-bold px-6 py-2 rounded-full shadow hover:bg-[#2d3748] transition">Request Bundle Info</a>
        </div>
        <div className="mb-6">
          <h5 className="font-semibold text-[#0d1321] mb-1">3. SaaS Platform: Modular Agents & Add-Ons</h5>
          <table className="min-w-full mb-4 border text-sm">
            <thead>
              <tr className="bg-[#e6f7fa]">
                <th className="p-2 border">Add-on</th>
                <th className="p-2 border">Description</th>
                <th className="p-2 border">Price</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="p-2 border">AI Summary Reports</td><td className="p-2 border">Auto-email weekly exec summary from Max</td><td className="p-2 border">$29/mo</td></tr>
              <tr><td className="p-2 border">CRM Sync</td><td className="p-2 border">Real-time Microsoft 365 or Salesforce sync</td><td className="p-2 border">$99/mo</td></tr>
              <tr><td className="p-2 border">Voice + Avatar Max</td><td className="p-2 border">Premium voice + Synthesia or D-ID avatar</td><td className="p-2 border">$149/mo</td></tr>
              <tr><td className="p-2 border">White-label Branding</td><td className="p-2 border">Client name + domain + colors</td><td className="p-2 border">$499 setup</td></tr>
              <tr><td className="p-2 border">AI Email Writer</td><td className="p-2 border">Smart templates + auto-personalization</td><td className="p-2 border">$39/mo</td></tr>
            </tbody>
          </table>
          <div className="text-[#00c2cb] font-semibold mb-2">Per-Agent Pricing Model (like Slack per-seat) + Usage-Based Add-ons (GPT-4o, voice, data integrations)</div>
          <a href="/pricing" className="inline-block bg-[#00c2cb] text-white font-bold px-6 py-2 rounded-full shadow hover:bg-[#00e0e6] transition">See SaaS Pricing</a>
        </div>
        <div className="mb-6">
          <h5 className="font-semibold text-[#0d1321] mb-1">4. Custom AI Agent Builds</h5>
          <ul className="list-disc ml-6 mb-2">
            <li><b>Offer:</b> “We build an AI employee to your exact specs.”</li>
            <li><b>Price:</b> $5k–$50k depending on use case</li>
            <li><b>Includes:</b> persona design, workflow mapping, integration, and support</li>
            <li><b>Delivered:</b> 14–30 days using our framework + OpenAI + Botpress + RAG</li>
          </ul>
          <a href="/contact" className="inline-block bg-[#0d1321] text-white font-bold px-6 py-2 rounded-full shadow hover:bg-[#2d3748] transition">Request Custom Build</a>
        </div>
        <div className="mb-6">
          <h5 className="font-semibold text-[#0d1321] mb-1">5. AI-Infused Coaching & Workshops</h5>
          <ul className="list-disc ml-6 mb-2">
            <li><b>Offer:</b> “AI for Sales Teams” or “How to Build AI into Your Workflow”</li>
            <li><b>Format:</b> Webinars (free lead gen), coaching, or workshops</li>
          </ul>
          <a href="/contact" className="inline-block bg-[#00c2cb] text-white font-bold px-6 py-2 rounded-full shadow hover:bg-[#00e0e6] transition">Request Workshop Info</a>
        </div>
        <div className="p-4 bg-[#e6f7fa] rounded-lg mb-4">
          <div className="font-bold text-[#0d1321] mb-1">🟢 What to do now:</div>
          <ul className="list-disc ml-6">
            <li>Offer pre-launch discounts or a lifetime deal to build urgency</li>
            <li>Create a demo-to-deal funnel — trial a single agent (Max) for 7 days</li>
            <li>Add one-click monthly upgrade prompts inside dashboard</li>
          </ul>
        </div>
        <div className="p-4 bg-[#fffbe6] rounded-lg">
          <div className="font-bold text-[#b7791f] mb-1">🧠 Bonus:</div>
          <ul className="list-disc ml-6">
            <li>Turn every deployment into a case study for inbound demand and social proof</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    icon: "/images/ai-nurture.svg",
    label: "Autonomous Lead Nurturing",
    summary: "AI agents engage, qualify, and nurture leads 24/7, ensuring no opportunity slips through the cracks.",
    stats: [
      { value: "+35%", label: "Reply Rate" },
      { value: "-50%", label: "Manual Effort" }
    ],
    details: (
      <div className="text-left">
        <h4 className="font-bold text-xl mb-2 text-[#00c2cb]">AI-Powered Lead Nurturing: Real-World Success Stories</h4>
        <p className="mb-4">At ApexSalesAI, we help businesses—from startups to enterprises—transform their lead nurturing with autonomous AI agents. Here’s how leading companies have leveraged AI to drive growth, and how we can do the same for you.</p>
        <div className="mb-4">
          <h5 className="font-semibold text-[#0d1321]">Enterprise Success Stories</h5>
          <ol className="list-decimal ml-6">
            <li className="mb-2">
              <b>Global SaaS Company Boosts Conversions by 35% with AI Email Nurturing</b>
              <ul className="list-disc ml-6">
                <li><b>Challenge:</b> Low email reply rates, missed opportunities due to manual follow-ups.</li>
                <li><b>AI Solution:</b> Adaptive email sequences, hyper-personalized follow-ups based on real-time behavior.</li>
                <li><b>Results:</b> 35% increase in replies, 28% faster deal closures, 50% less manual effort.</li>
              </ul>
              <div className="italic text-[#00c2cb] mt-1">Our Autonomous Email Nurturing system ensures no lead slips through the cracks. AI analyzes engagement and delivers the right message at the right time—just like it did for this enterprise.</div>
            </li>
            <li className="mb-2">
              <b>Fortune 500 Retailer Cuts Lead Response Time from Hours to Seconds</b>
              <ul className="list-disc ml-6">
                <li><b>Challenge:</b> Lost high-intent leads due to delayed responses.</li>
                <li><b>AI Solution:</b> AI chatbots instantly qualify leads and book meetings, real-time lead scoring.</li>
                <li><b>Results:</b> 50% faster responses, 3x more meetings, 20% more revenue per lead.</li>
              </ul>
              <div className="italic text-[#00c2cb] mt-1">Our Smart Chat Assist acts as a 24/7 sales rep, so you never miss a high-value lead.</div>
            </li>
            <li className="mb-2">
              <b>Financial Services Firm Shortens Sales Cycle by 25% with Predictive AI</b>
              <ul className="list-disc ml-6">
                <li><b>Challenge:</b> Needed to identify and nurture high-intent leads faster.</li>
                <li><b>AI Solution:</b> Predictive lead scoring, dynamic content delivery.</li>
                <li><b>Results:</b> 25% shorter sales cycle, 40% higher conversions, 30% more upsell opps.</li>
              </ul>
              <div className="italic text-[#00c2cb] mt-1">Our Predictive Lead Engine identifies your hottest prospects and nurtures them with personalized content.</div>
            </li>
          </ol>
        </div>
        <div className="mb-4">
          <h5 className="font-semibold text-[#0d1321]">SMB Success Stories</h5>
          <ol className="list-decimal ml-6">
            <li className="mb-2">
              <b>E-Commerce Store Increases Revenue by 40% with AI-Powered Retargeting</b>
              <ul className="list-disc ml-6">
                <li><b>Challenge:</b> Abandoned carts, low repeat purchases.</li>
                <li><b>AI Solution:</b> AI-driven retargeting ads, automated SMS & Messenger follow-ups.</li>
                <li><b>Results:</b> 40% more recovered sales, 30% higher retention, 50% lower CPL.</li>
              </ul>
              <div className="italic text-[#00c2cb] mt-1">Our Ad & SMS Nurturing turns window shoppers into buyers—without a big team.</div>
            </li>
            <li className="mb-2">
              <b>Local HVAC Company Books 50% More Appointments with AI Follow-Ups</b>
              <ul className="list-disc ml-6">
                <li><b>Challenge:</b> Losing leads due to slow response.</li>
                <li><b>AI Solution:</b> Automated SMS & WhatsApp nurturing, AI chatbot lead qualification.</li>
                <li><b>Results:</b> 50% more appointments, 15% more repeat customers, 80% less manual follow-up.</li>
              </ul>
              <div className="italic text-[#00c2cb] mt-1">Our AI Lead Engagement Suite lets your team close more, chase less.</div>
            </li>
            <li className="mb-2">
              <b>B2B Consulting Firm 3x’s Lead Conversions with AI Chat & Email</b>
              <ul className="list-disc ml-6">
                <li><b>Challenge:</b> Couldn’t keep up with inbound inquiries, missed opportunities.</li>
                <li><b>AI Solution:</b> AI chatbots to capture/qualify leads 24/7, automated email sequences.</li>
                <li><b>Results:</b> 3x more qualified leads, 20% higher close rate, fully booked calendar.</li>
              </ul>
              <div className="italic text-[#00c2cb] mt-1">Our Autonomous Lead Nurturing System fills your pipeline while you sleep.</div>
            </li>
          </ol>
        </div>
        <div className="mb-4">
          <h5 className="font-semibold text-[#0d1321]">Why ApexSalesAI?</h5>
          <ul className="list-disc ml-6">
            <li>✔ Proven Results – Higher conversions, faster sales cycles, more revenue.</li>
            <li>✔ No Big Team Needed – AI handles 80% of follow-ups, your team closes.</li>
            <li>✔ Seamless Integration – Works with your CRM, ads, email, and social.</li>
          </ul>
        </div>
        <div className="text-center mt-6">
          <a href="/demo" className="inline-block bg-[#00c2cb] text-white font-bold px-8 py-3 rounded-full shadow-lg hover:bg-[#00e0e6] transition">Get a Free Demo</a>
        </div>
      </div>
    ),
  },
  {
    icon: "/images/ai-forecast.svg",
    label: "Predictive Forecasting",
    summary: "Accurately forecast revenue with AI-driven pipeline analysis.",
    stats: [
      { value: "+20%", label: "Forecast Accuracy" },
      { value: "-30%", label: "Manual Forecasting Effort" }
    ],
    details: (
      <div className="text-left">
        <h4 className="font-bold text-xl mb-2 text-[#00c2cb]">Predictive Forecasting: Unlock Data-Driven Revenue Growth</h4>
        <p className="mb-4">Accurate forecasting is key to driving business growth, but manual forecasting methods are often inaccurate and time-consuming. ApexSalesAI’s Predictive Forecasting uses machine learning to analyze your pipeline and deliver precise revenue predictions—automatically.</p>
        <p className="mb-4">Here’s how leading companies are leveraging AI to transform their forecasting, and how ApexSalesAI can help you make data-driven decisions.</p>
        <div className="mb-4">
          <h5 className="font-semibold text-[#0d1321]">Enterprise Success Stories</h5>
          <ol className="list-decimal ml-6">
            <li className="mb-2">
              <b>Global Software Company Boosts Forecast Accuracy by 20% with AI</b>
              <ul className="list-disc ml-6">
                <li><b>Challenge:</b> Inaccurate forecasting led to missed revenue targets.</li>
                <li><b>AI Solution:</b> Predictive pipeline analysis, automated deal scoring.</li>
                <li><b>Results:</b> 20% more accurate forecasts, 30% less manual effort, 15% higher revenue.</li>
              </ul>
              <div className="italic text-[#00c2cb] mt-1">Our Predictive Forecasting Engine analyzes your pipeline to deliver precise revenue predictions.</div>
            </li>
            <li className="mb-2">
              <b>Fortune 500 Manufacturer Reduces Forecasting Time by 75% with AI</b>
              <ul className="list-disc ml-6">
                <li><b>Challenge:</b> Manual forecasting took weeks, delaying business decisions.</li>
                <li><b>AI Solution:</b> Automated pipeline analysis, real-time forecasting updates.</li>
                <li><b>Results:</b> 75% less time spent forecasting, 25% higher forecast accuracy, 10% more revenue.</li>
              </ul>
              <div className="italic text-[#00c2cb] mt-1">Our AI Forecasting Module streamlines your forecasting process, freeing up more time for strategy.</div>
            </li>
            <li className="mb-2">
              <b>B2B SaaS Company Eliminates "Hopeful" Forecasting with AI-Driven Insights</b>
              <ul className="list-disc ml-6">
                <li><b>Challenge:</b> Forecasting relied on intuition, leading to inaccurate predictions.</li>
                <li><b>AI Solution:</b> Data-driven forecasting, automated deal health analysis.</li>
              </ul>
              <div className="italic text-[#00c2cb] mt-1">Our Deal Probability AI helps you bet on the right opportunities.</div>
            </li>
            <li className="mb-2">
              <b>E-Commerce Brand Cuts Inventory Costs by 25% with AI Demand Forecasting</b>
              <ul className="list-disc ml-6">
                <li><b>Challenge:</b> Seasonal demand spikes, overstock/stockouts.</li>
                <li><b>AI Solution:</b> Unified sales/inventory forecasting, 6-month demand prediction based on marketing spend/trends.</li>
                <li><b>Results:</b> 25% lower inventory costs, 18% fewer stockouts, optimized ad spend.</li>
              </ul>
              <div className="italic text-[#00c2cb] mt-1">Our Demand Forecasting Module connects sales pipelines to operational planning.</div>
            </li>
          </ol>
        </div>
        <div className="mb-4">
          <h5 className="font-semibold text-[#0d1321]">Why ApexSalesAI for Predictive Forecasting?</h5>
          <ul className="list-disc ml-6">
            <li>✔ 90%+ Forecast Accuracy – Machine learning adapts to your business patterns</li>
            <li>✔ Real-Time Anomaly Detection – Get alerts before deals go off track</li>
            <li>✔ Seamless CRM Integration – Works with Salesforce, HubSpot, Pipedrive & more</li>
            <li>✔ No Data Science Team Needed – Get enterprise-grade AI in minutes</li>
          </ul>
        </div>
        <div className="text-center mt-6">
          <a href="/demo" className="inline-block bg-[#00c2cb] text-white font-bold px-8 py-3 rounded-full shadow-lg hover:bg-[#00e0e6] transition">See ApexSalesAI Forecasting in Action</a>
          <div className="mt-2 text-[#0d1321] font-semibold">Turn your pipeline into predictable revenue with AI.</div>
        </div>
      </div>
    ),
  },
  {
    icon: "/images/ai-support.svg",
    label: "Conversational AI Support",
    summary: "Deliver instant, human-like assistance 24/7 across chat, email, and messaging platforms.",
    stats: [
      { value: "-40%", label: "Support Costs" },
      { value: "+90%", label: "Faster Response" }
    ],
    details: (
      <div className="text-left">
        <h4 className="font-bold text-xl mb-2 text-[#00c2cb]">Conversational AI Support: Deliver Instant, Human-Like Assistance 24/7</h4>
        <p className="mb-4">Today’s customers expect instant, personalized support—around the clock. ApexSalesAI’s Conversational AI Support provides automated yet human-like assistance across chat, email, and messaging platforms, ensuring no customer query goes unanswered.</p>
        <p className="mb-4">Here’s how industry leaders leverage AI-powered support to boost satisfaction and efficiency—and how ApexSalesAI can transform your customer experience.</p>
        <div className="mb-4">
          <h5 className="font-semibold text-[#0d1321]">Enterprise Success Stories</h5>
          <ol className="list-decimal ml-6">
            <li className="mb-2">
              <b>Global E-Commerce Giant Cuts Support Costs by 40% with AI Chatbots</b>
              <ul className="list-disc ml-6">
                <li><b>Challenge:</b> Overwhelming customer service requests, long wait times.</li>
                <li><b>AI Solution:</b> AI chatbots handled 70% of routine inquiries, seamless human handoff for complex issues.</li>
                <li><b>Results:</b> 40% reduction in costs, 90% faster response, 15% higher CSAT from 24/7 availability.</li>
              </ul>
              <div className="italic text-[#00c2cb] mt-1">Our Smart Support Chatbots resolve common queries instantly while escalating complex issues.</div>
            </li>
            <li className="mb-2">
              <b>Enterprise Software Company Scales Support Without Adding Headcount</b>
              <ul className="list-disc ml-6">
                <li><b>Challenge:</b> Support team couldn’t keep up with rapid growth.</li>
                <li><b>AI Solution:</b> AI-driven email triage and in-product conversational AI for onboarding.</li>
                <li><b>Results:</b> 60% of tier-1 tickets resolved autonomously, 5x support capacity, 30% faster onboarding.</li>
              </ul>
              <div className="italic text-[#00c2cb] mt-1">Our Multi-Channel Support AI scales your team effortlessly.</div>
            </li>
            <li className="mb-2">
              <b>Financial Institution Reduces Call Volume by 35% with AI Self-Service</b>
              <ul className="list-disc ml-6">
                <li><b>Challenge:</b> Call centers overwhelmed with basic inquiries.</li>
                <li><b>AI Solution:</b> AI voice assistants for account info, SMS-based support for quick questions.</li>
                <li><b>Results:</b> 35% fewer calls, 24/7 support, $2M+ annual savings.</li>
              </ul>
              <div className="italic text-[#00c2cb] mt-1">Our Omnichannel Support Automation delivers consistent AI help across phone, text, and chat.</div>
            </li>
          </ol>
        </div>
        <div className="mb-4">
          <h5 className="font-semibold text-[#0d1321]">SMB Success Stories</h5>
          <ol className="list-decimal ml-6">
            <li className="mb-2">
              <b>Fast-Growing DTC Brand Offers 24/7 Support Without Hiring Night Staff</b>
              <ul className="list-disc ml-6">
                <li><b>Challenge:</b> Missed after-hours orders and queries.</li>
                <li><b>AI Solution:</b> AI chatbots for post-purchase questions, automated order tracking via Messenger.</li>
                <li><b>Results:</b> 100% query coverage, 28% higher conversion rates, 4.9-star support rating.</li>
              </ul>
              <div className="italic text-[#00c2cb] mt-1">Our Always-On Commerce Assistants give SMBs enterprise-level support capabilities.</div>
            </li>
            <li className="mb-2">
              <b>Local HVAC Company Books 50% More Service Calls After Implementing AI Chat</b>
              <ul className="list-disc ml-6">
                <li><b>Challenge:</b> Missed service opportunities when staff was unavailable.</li>
                <li><b>AI Solution:</b> AI-powered website chat to qualify service requests 24/7, automated call-back scheduling.</li>
                <li><b>Results:</b> 50% more calls booked after hours, 80% reduction in missed leads, 40% faster emergency response.</li>
              </ul>
              <div className="italic text-[#00c2cb] mt-1">Our Service Industry Chatbots capture and qualify leads even when your team is offline.</div>
            </li>
            <li className="mb-2">
              <b>B2B SaaS Startup Cuts Support Ticket Resolution Time by 65%</b>
              <ul className="list-disc ml-6">
                <li><b>Challenge:</b> Small team struggled with ticket backlogs.</li>
                <li><b>AI Solution:</b> AI email support to auto-resolve technical questions, AI-powered knowledge base.</li>
                <li><b>Results:</b> 65% faster resolution, 50% fewer repeat tickets, 30% higher NPS scores.</li>
              </ul>
              <div className="italic text-[#00c2cb] mt-1">Our AI Support Co-Pilot helps small teams deliver big-company response times and quality.</div>
            </li>
          </ol>
        </div>
        <div className="mb-4">
          <h5 className="font-semibold text-[#0d1321]">Why Choose ApexSalesAI for Conversational Support?</h5>
          <ul className="list-disc ml-6">
            <li>✔ Human-Like Interactions – Advanced NLP for natural, helpful conversations</li>
            <li>✔ Omnichannel Ready – Deploy across website chat, email, SMS, and messaging apps</li>
            <li>✔ Seamless Integration – Works with Zendesk, Shopify, Salesforce, and more</li>
            <li>✔ Continuous Learning – AI improves from every customer interaction</li>
          </ul>
        </div>
        <div className="text-center mt-6">
          <a href="/demo" className="inline-block bg-[#00c2cb] text-white font-bold px-8 py-3 rounded-full shadow-lg hover:bg-[#00e0e6] transition">Experience ApexSalesAI Conversational Support</a>
          <div className="mt-2 text-[#0d1321] font-semibold">Deliver instant, exceptional support—day or night—without scaling your team.</div>
        </div>
      </div>
    ),
  },
];

const AIUseCasesSection = () => {
  const [modalIdx, setModalIdx] = useState<number | null>(null);

  return (
    <section className="py-16 bg-[#f8fafc]">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-[#00c2cb] to-[#a0aec0] bg-clip-text text-transparent">AI Agent Use Cases</h2>
        <p className="text-lg text-[#0d1321] mb-12 max-w-2xl mx-auto">See how ApexSalesAI delivers real business results with autonomous, intelligent sales agents.</p>
        <div className="grid md:grid-cols-2 gap-10 mb-8">
          {useCases.map((uc, i) => (
            <div key={i} className="panel flex flex-col justify-between shadow-lg radius-lg hover:-translate-y-2 transition-all bg-white border border-[#00c2cb]/10 min-h-[370px]">
              {/* Top section: icon + stats */}
              <div className="flex flex-col items-center pt-8 pb-4 border-b border-[#2d3748]/10 w-full">
                <div className="mb-4 flex items-center justify-center w-full">
                  <img src={uc.icon} alt={uc.label + ' icon'} width={64} height={64} className="drop-shadow-xl animate-fade-in" style={{transition: 'transform 0.3s', filter: 'brightness(1.15) saturate(1.2)'}} loading="eager" />
                </div>
                <div className="flex gap-6 mb-2">
                  {uc.stats.map((stat: { value: string; label: string }, idx: number) => (
                    <div key={idx} className="flex flex-col items-center">
                      <span className="text-2xl font-extrabold text-[#00c2cb] leading-tight">{stat.value}</span>
                      <span className="text-xs text-[#7b8a99] font-medium">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Bottom section: description + CTA */}
              <div className="flex flex-col items-center px-6 pb-8 pt-4 grow">
                <h3 className="heading-lg mb-1 text-lg font-bold text-[#0d1321]">{uc.label}</h3>
                <p className="text-[#4a5568] text-sm mb-4 text-center">{uc.summary}</p>
                <button onClick={() => setModalIdx(i)} className="inline-block mt-auto btn-secondary text-sm px-4 py-2 rounded-full border border-[#00c2cb] text-[#00c2cb] hover:bg-[#00c2cb]/10 transition-all font-semibold">
                  Explore Use Case
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Modal for details */}
        {modalIdx !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative animate-fade-in-up overflow-y-auto max-h-[90vh]">
              <button onClick={() => setModalIdx(null)} className="absolute top-4 right-4 text-[#00c2cb] text-2xl font-bold hover:text-[#0d1321]">&times;</button>
              {useCases[modalIdx].details}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AIUseCasesSection;
