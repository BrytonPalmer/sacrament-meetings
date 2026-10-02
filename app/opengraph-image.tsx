import { ImageResponse } from 'next/og';

export const alt = 'Sacrament Meeting Planner';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1f2937',
          color: 'white',
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 700 }}>Sacrament Meeting Planner</div>
        <div style={{ fontSize: 28, fontWeight: 400, marginTop: 20, color: '#d1d5db' }}>
          Plan, manage, and review sacrament meeting agendas
        </div>
      </div>
    ),
    { ...size }
  );
}