import React from 'react';
import { Screen } from '../types';
import { APP_COLORS, TYPOGRAPHY, GOVERNORATES } from '../constants';
import { ChevronRight, MapPin, Check } from 'lucide-react';

interface Props {
  push: (screen: Screen, props?: Record<string, any>) => void;
  pop: () => void;
  selectedCity: string;
  setSelectedCity: (id: string) => void;
}

export default function CitySelectScreen({ pop, selectedCity, setSelectedCity }: Props) {
  return (
    <div style={{ backgroundColor: APP_COLORS.BACKGROUND, minHeight: '100%' }}>
      {/* Header */}
      <div style={{
        padding: '40px 20px 15px',
        backgroundColor: APP_COLORS.SURFACE,
        borderBottom: `1px solid ${APP_COLORS.BORDER}`,
        display: 'flex',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div onClick={pop} style={{ cursor: 'pointer', marginLeft: 15 }}>
          <ChevronRight size={24} color={APP_COLORS.TEXT_PRIMARY} />
        </div>
        <h2 style={{ ...TYPOGRAPHY.headline, margin: 0, fontSize: 18 }}>اختر المدينة</h2>
      </div>

      <div style={{ padding: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {GOVERNORATES.map(city => {
            const isSelected = city.id === selectedCity;
            return (
              <div 
                key={city.id}
                onClick={() => {
                  setSelectedCity(city.id);
                  pop();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: APP_COLORS.SURFACE,
                  padding: '16px 20px',
                  borderRadius: 16,
                  boxShadow: APP_COLORS.SHADOW,
                  cursor: 'pointer',
                  border: isSelected ? `2px solid ${APP_COLORS.PRIMARY}` : '2px solid transparent'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <MapPin size={20} color={isSelected ? APP_COLORS.PRIMARY : APP_COLORS.TEXT_SECONDARY} />
                  <span style={{ ...TYPOGRAPHY.headline, fontSize: 16, color: isSelected ? APP_COLORS.PRIMARY : APP_COLORS.TEXT_PRIMARY }}>
                    {city.name.ar}
                  </span>
                </div>
                {isSelected && <Check size={20} color={APP_COLORS.PRIMARY} />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
