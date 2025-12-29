import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'Lyfye';
    const subtitle = searchParams.get('subtitle') || 'No VC. No ads. Just product.';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0a0a0a',
            backgroundImage:
              'radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.05) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(255, 255, 255, 0.05) 2%, transparent 0%)',
            backgroundSize: '100px 100px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px',
              maxWidth: '900px',
            }}
          >
            <h1
              style={{
                fontSize: '72px',
                fontWeight: 'bold',
                background: 'linear-gradient(to right, #ffffff, #a0a0a0)',
                backgroundClip: 'text',
                color: 'transparent',
                margin: '0',
                padding: '0',
                textAlign: 'center',
                lineHeight: '1.1',
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: '32px',
                color: '#888',
                margin: '24px 0 0 0',
                textAlign: 'center',
              }}
            >
              {subtitle}
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '48px',
                gap: '16px',
              }}
            >
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#ffffff',
                }}
              >
                LYFYE
              </div>
              <div
                style={{
                  width: '4px',
                  height: '24px',
                  backgroundColor: '#333',
                }}
              />
              <div
                style={{
                  fontSize: '20px',
                  color: '#666',
                }}
              >
                R&D AI Technology
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('OG image generation error:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
