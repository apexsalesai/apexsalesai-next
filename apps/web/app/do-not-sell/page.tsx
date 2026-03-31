import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Do Not Sell My Personal Information | ApexSalesAI',
  description: 'Exercise your California Consumer Privacy Act (CCPA) rights with ApexSalesAI.',
};

export default function DoNotSellPage() {
  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 24px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '24px' }}>
        Do Not Sell My Personal Information
      </h1>

      <section style={{ marginBottom: '32px', lineHeight: '1.8' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '12px' }}>
          Your Rights Under CCPA
        </h2>
        <p>
          Under the California Consumer Privacy Act (CCPA), California residents have the right
          to opt out of the sale of their personal information. ApexSalesAI respects your privacy
          and provides this page to exercise that right.
        </p>
      </section>

      <section style={{ marginBottom: '32px', lineHeight: '1.8' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '12px' }}>
          What We Collect
        </h2>
        <p>
          ApexSalesAI may collect browsing data, device information, and usage analytics through
          cookies and similar technologies. We do not sell personal information in the
          traditional sense, but some data sharing with analytics providers may qualify as a
          &quot;sale&quot; under CCPA.
        </p>
      </section>

      <section style={{ marginBottom: '32px', lineHeight: '1.8' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '12px' }}>
          How to Opt Out
        </h2>
        <p>
          To opt out of the sale of your personal information, you can:
        </p>
        <ul style={{ paddingLeft: '24px', marginTop: '8px' }}>
          <li style={{ marginBottom: '8px' }}>
            Click &quot;Essential Only&quot; on the cookie consent banner to disable analytics and
            marketing cookies
          </li>
          <li style={{ marginBottom: '8px' }}>
            Email us at{' '}
            <a href="mailto:privacy@lyfye.com" style={{ color: '#2563eb' }}>
              privacy@lyfye.com
            </a>{' '}
            with the subject line &quot;CCPA Opt-Out Request&quot;
          </li>
          <li style={{ marginBottom: '8px' }}>
            Clear your browser cookies to reset your consent preferences
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: '32px', lineHeight: '1.8' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '12px' }}>
          Non-Discrimination
        </h2>
        <p>
          ApexSalesAI will not discriminate against you for exercising your CCPA rights. You will
          continue to receive the same quality of service regardless of your privacy choices.
        </p>
      </section>

      <section style={{ lineHeight: '1.8' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '12px' }}>
          Contact
        </h2>
        <p>
          For questions about this policy or to exercise your privacy rights, contact us at{' '}
          <a href="mailto:privacy@lyfye.com" style={{ color: '#2563eb' }}>
            privacy@lyfye.com
          </a>
          .
        </p>
      </section>
    </main>
  );
}
