'use client';
import { useState } from "react";
import { FaRobot } from "react-icons/fa";

const useCases = [ // <-- open array
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
    ],
    details: (
      <div className="text-left">
        <h4 className="font-bold text-xl mb-2 text-[#00c2cb]">AI-Powered Customer Retention Automation: Turn At-Risk Customers Into Loyal Advocates</h4>
        <p className="mb-4">Losing customers is costly—studies show acquiring a new customer is 5-25x more expensive than retaining an existing one. ApexSalesAI’s Customer Retention Automation uses machine learning to predict churn risks before they happen and trigger personalized retention campaigns—autonomously.</p>
        <p className="mb-4">Here’s how leading companies are reducing churn with AI, and how ApexSalesAI can do the same for your business.</p>
        <div className="mb-4">
          <h5 className="font-semibold text-[#0d1321]">Enterprise Success Stories</h5>
          <ol className="list-decimal ml-6">
            <li className="mb-2">
              <b>Global SaaS Company Reduces Churn by 30% with AI-Powered Retention</b>
              <ul className="list-disc ml-6">
                <li><b>Challenge:</b> Unexpected customer cancellations, hurting recurring revenue.</li>
                <li><b>AI Solution:</b> Predictive churn scoring using 50+ behavioral signals. Automated win-back campaigns for at-risk accounts.</li>
                <li><b>Results:</b> 30% reduction in churn, 22% increase in expansion revenue, fully automated retention system.</li>
              </ul>
              <div className="italic text-[#00c2cb] mt-1">Our Churn Prediction Engine identifies at-risk customers with 92% accuracy—then triggers hyper-targeted save campaigns automatically.</div>
            </li>
            <li className="mb-2">
              <b>Fortune 500 Telecom Cuts Cancellations by $4M Annually</b>
              <ul className="list-disc ml-6">
                <li><b>Challenge:</b> Rising cancellations after promotions ended.</li>
                <li><b>AI Solution:</b> AI flags customers nearing contract end dates, triggers automated retention offers via SMS and email.</li>
                <li><b>Results:</b> $4M+ in annual saved revenue, 40% improvement in offer acceptance, 18% higher ARPU from retained customers.</li>
              </ul>
              <div className="italic text-[#00c2cb] mt-1">Our Contract Renewal AI predicts expiration risks and auto-delivers the perfect retention offer—just like this telecom giant.</div>
            </li>
            <li className="mb-2">
              <b>Financial Services Firm Boosts Retention 25% with Real-Time Intervention</b>
              <ul className="list-disc ml-6">
                <li><b>Challenge:</b> Couldn’t proactively address silent attrition (accounts going inactive).</li>
                <li><b>AI Solution:</b> Machine learning detects disengagement signals, triggers check-ins from relationship managers.</li>
                <li><b>Results:</b> 25% improvement in retention, 50% faster response to at-risk accounts, 17% more referrals from reactivated clients.</li>
              </ul>
              <div className="italic text-[#00c2cb] mt-1">Our Silent Attrition Detector spots disengagement before it’s visible—then triggers human or automated re-engagement.</div>
            </li>
          </ol>
        </div>
        <div className="mb-4">
          <h5 className="font-semibold text-[#0d1321]">SMB Success Stories</h5>
          <ol className="list-decimal ml-6">
            <li className="mb-2">
              <b>Subscription Box Company Saves 300+ Customers Monthly</b>
              <ul className="list-disc ml-6">
                <li><b>Challenge:</b> 8% monthly churn from credit card declines and disengagement.</li>
                <li><b>AI Solution:</b> Predicts cancellation risks 30 days in advance, automates win-back flows and payment retries.</li>
                <li><b>Results:</b> 300+ customers saved monthly, 65% payment recovery, 22% higher LTV from retained subs.</li>
              </ul>
              <div className="italic text-[#00c2cb] mt-1">Our Subscription Rescue Module automatically recovers failed payments and re-engages lapsing customers—perfect for recurring revenue businesses.</div>
            </li>
            <li className="mb-2">
              <b>Local MSP Retains 40% More Clients with Proactive AI Alerts</b>
              <ul className="list-disc ml-6">
                <li><b>Challenge:</b> Losing clients to competitors without warning.</li>
                <li><b>AI Solution:</b> AI monitors service ticket patterns, triggers CSAT surveys and account manager alerts for unhappy clients.</li>
                <li><b>Results:</b> 40% improvement in retention, 50% faster resolution on at-risk accounts, 9.1 average CSAT score.</li>
              </ul>
              <div className="italic text-[#00c2cb] mt-1">Our Client Health Monitoring system gives SMBs enterprise-grade retention tools—without the complexity.</div>
            </li>
            <li className="mb-2">
              <b>E-Commerce Brand Slashes Returns & Increases Loyalty</b>
              <ul className="list-disc ml-6">
                <li><b>Challenge:</b> High return rates hurting profitability.</li>
                <li><b>AI Solution:</b> Identifies "serial returners" and predicts future returns, automates sizing guides and early exchange offers.</li>
                <li><b>Results:</b> 28% reduction in return rates, 15% increase in repeat purchases, higher margins from fewer returns.</li>
              </ul>
              <div className="italic text-[#00c2cb] mt-1">Our Returns Prediction AI helps product businesses improve satisfaction while protecting profits.</div>
            </li>
          </ol>
        </div>
        <div className="mb-4">
          <h5 className="font-semibold text-[#0d1321]">Why ApexSalesAI for Customer Retention?</h5>
          <ul className="list-disc ml-6">
            <li>✔ Predict Churn Before It Happens – 90%+ accuracy in identifying at-risk customers</li>
            <li>✔ Autonomous Retention Campaigns – Email, SMS, in-app and more—triggered automatically</li>
            <li>✔ Seamless Integration – Works with your CRM, helpdesk, and payment systems</li>
            <li>✔ Proven ROI – Clients typically see 3-6x ROI from saved revenue</li>
          </ul>
        </div>
        <div className="text-center mt-6">
          <a href="/demo" className="inline-block bg-[#00c2cb] text-white font-bold px-8 py-3 rounded-full shadow-lg hover:bg-[#00e0e6] transition">Discover ApexSalesAI Retention Automation – Book your free demo today.</a>
          <div className="mt-2 text-[#0d1321] font-semibold">Turn customer retention into your competitive advantage with AI.</div>
        </div>
      </div>
    ),
  },
  {
    icon: "/images/ai-forecast.svg",
    label: "Predictive Revenue Forecasting",
    summary: "AI delivers real-time, highly accurate revenue forecasts so you can plan and scale with confidence.",
    stats: [
      { value: "+40%", label: "Forecast Accuracy" },
      { value: "-80%", label: "Manual Forecasting" }
    ],
    details: (
      <div className="text-left">
        <h4 className="font-bold text-xl mb-2 text-[#00c2cb]">AI-Powered Predictive Revenue Forecasting: Drive Smarter Growth</h4>
        <p className="mb-4">Accurate revenue forecasting is critical for scaling businesses—yet most companies rely on guesswork or outdated spreadsheets. ApexSalesAI’s Predictive Revenue Forecasting uses machine learning to analyze your pipeline in real time, delivering actionable insights to maximize revenue and minimize risk.</p>
        <p className="mb-4">Here’s how leading companies leverage AI-driven forecasting—and how ApexSalesAI can do the same for you.</p>
        <div className="mb-4">
          <h5 className="font-semibold text-[#0d1321]">Enterprise Success Stories</h5>
          <ol className="list-decimal ml-6">
            <li className="mb-2">
              <b>Global SaaS Company Reduces Forecast Errors by 60% with AI</b>
              <ul className="list-disc ml-6">
                <li><b>Challenge:</b> Inaccurate quarterly forecasts, missed targets, inefficient resource allocation.</li>
                <li><b>AI Solution:</b> ML models analyze historical deals, win/loss patterns, external signals. Automated real-time pipeline health scoring.</li>
                <li><b>Results:</b> 60% reduction in variance, 25% better quota attainment, faster market adjustment.</li>
              </ul>
              <div className="italic text-[#00c2cb] mt-1">Our Predictive Revenue Engine provides forecasts with 90%+ accuracy—so you can plan with confidence.</div>
            </li>
            <li className="mb-2">
              <b>Fortune 500 Manufacturer Boosts Revenue Predictability by 40%</b>
              <ul className="list-disc ml-6">
                <li><b>Challenge:</b> Inconsistent projections due to complex B2B cycles.</li>
                <li><b>AI Solution:</b> Deal scoring to predict closes, integrated external signals for smarter forecasting.</li>
                <li><b>Results:</b> 40% more accurate forecasts, 15% higher win rates, fewer revenue surprises.</li>
              </ul>
              <div className="italic text-[#00c2cb] mt-1">Our AI Opportunity Scoring finds hidden risks and upside in your pipeline.</div>
            </li>
            <li className="mb-2">
              <b>Financial Services Firm Cuts Month-End Crunch with Real-Time Forecasting</b>
              <ul className="list-disc ml-6">
                <li><b>Challenge:</b> Manual, time-consuming forecast adjustments.</li>
                <li><b>AI Solution:</b> Self-updating AI forecasts, scenario modeling for best/worst-case outcomes.</li>
                <li><b>Results:</b> 80% less time spent, real-time revenue visibility, more accurate board reporting.</li>
              </ul>
              <div className="italic text-[#00c2cb] mt-1">Our Automated Forecasting Dashboard gives your team always-on insights.</div>
            </li>
          </ol>
        </div>
        <div className="mb-4">
          <h5 className="font-semibold text-[#0d1321]">SMB Success Stories</h5>
          <ol className="list-decimal ml-6">
            <li className="mb-2">
              <b>Mid-Sized Tech Agency Grows Revenue 30% with AI Pipeline Insights</b>
              <ul className="list-disc ml-6">
                <li><b>Challenge:</b> Lacked visibility into which deals would close, cash flow gaps.</li>
                <li><b>AI Solution:</b> AI-powered pipeline analytics, automated alerts for stalled deals.</li>
                <li><b>Results:</b> 30% revenue growth, 50% fewer surprise misses, better hiring/timing decisions.</li>
              </ul>
              <div className="italic text-[#00c2cb] mt-1">Our Pipeline Intelligence System helps SMBs forecast like enterprises.</div>
            </li>
            <li className="mb-2">
              <b>Local Commercial Contractor Wins 20% More Bids with AI Probability Scoring</b>
              <ul className="list-disc ml-6">
                <li><b>Challenge:</b> Overestimating project wins, resource mismanagement.</li>
                <li><b>AI Solution:</b> ML analysis of historical bid outcomes, real-time win probability for each opportunity.</li>
                <li><b>Results:</b> 20% more successful bids, 30% better resource planning, eliminated "hopeful" forecasting.</li>
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
  }
]; // end of useCases array            <li className="mb-2">
              <b>Fortune 500 Manufacturer Boosts Revenue Predictability by 40%</b>
              <ul className="list-disc ml-6">
                <li><b>Challenge:</b> Inconsistent projections due to complex B2B cycles.</li>
                <li><b>AI Solution:</b> Deal scoring to predict closes, integrated external signals for smarter forecasting.</li>
                <li><b>Results:</b> 40% more accurate forecasts, 15% higher win rates, fewer revenue surprises.</li>
              </ul>
              <div className="italic text-[#00c2cb] mt-1">Our AI Opportunity Scoring finds hidden risks and upside in your pipeline.</div>
            </li>
            <li className="mb-2">
              <b>Financial Services Firm Cuts Month-End Crunch with Real-Time Forecasting</b>
              <ul className="list-disc ml-6">
                <li><b>Challenge:</b> Manual, time-consuming forecast adjustments.</li>
                <li><b>AI Solution:</b> Self-updating AI forecasts, scenario modeling for best/worst-case outcomes.</li>
                <li><b>Results:</b> 80% less time spent, real-time revenue visibility, more accurate board reporting.</li>
              </ul>
              <div className="italic text-[#00c2cb] mt-1">Our Automated Forecasting Dashboard gives your team always-on insights.</div>
            </li>
          </ol>
        </div>
        <div className="mb-4">
          <h5 className="font-semibold text-[#0d1321]">SMB Success Stories</h5>
          <ol className="list-decimal ml-6">
            <li className="mb-2">
              <b>Mid-Sized Tech Agency Grows Revenue 30% with AI Pipeline Insights</b>
              <ul className="list-disc ml-6">
                <li><b>Challenge:</b> Lacked visibility into which deals would close, cash flow gaps.</li>
                <li><b>AI Solution:</b> AI-powered pipeline analytics, automated alerts for stalled deals.</li>
                <li><b>Results:</b> 30% revenue growth, 50% fewer surprise misses, better hiring/timing decisions.</li>
              </ul>
              <div className="italic text-[#00c2cb] mt-1">Our Pipeline Intelligence System helps SMBs forecast like enterprises.</div>
            </li>
            <li className="mb-2">
              <b>Local Commercial Contractor Wins 20% More Bids with AI Probability Scoring</b>
              <ul className="list-disc ml-6">
                <li><b>Challenge:</b> Overestimating project wins, resource mismanagement.</li>
                <li><b>AI Solution:</b> ML analysis of historical bid outcomes, real-time win probability for each opportunity.</li>
                <li><b>Results:</b> 20% more successful bids, 30% better resource planning, eliminated "hopeful" forecasting.</li>
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
import React, { useState } from "react";

const useCases = [ // <-- open array
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
        {/* ...details content... */}
      </div>
    ),
  },
  {
    icon: "/images/ai-forecast.svg",
    label: "Predictive Revenue Forecasting",
    summary: "AI delivers real-time, highly accurate revenue forecasts so you can plan and scale with confidence.",
    stats: [
      { value: "+40%", label: "Forecast Accuracy" },
      { value: "-80%", label: "Manual Forecasting" }
    ],
    details: (
      <div className="text-left">
        {/* ...details content... */}
      </div>
    ),
  }
]; // end of useCases array

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
