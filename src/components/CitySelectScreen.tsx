import React from 'react';
import { Screen, Governorate } from '../types';
import { APP_COLORS, TYPOGRAPHY, GOVERNORATES } from '../constants';
import { ChevronRight, MapPin, Check } from 'lucide-react';

interface Props {
  push: (screen: Screen, props?: Record<string, any>) => void;
  pop: () => void;
  selectedCity: string;
  setSelectedCity: (id: string) => void;
  lang: string;
  t: any;
  isRTL: boolean;
}

export default function CitySelectScreen({ pop, selectedCity, setSelectedCity, lang, t, isRTL }: Props) {
  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="pt-10 pb-4 px-5 bg-surface border-b border-border flex items-center sticky top-0 z-10">
        <div onClick={pop} className={`cursor-pointer ${isRTL ? 'ml-0 mr-4' : 'ml-4 mr-0'}`}>
          <ChevronRight size={24} className={`text-text-primary ${isRTL ? '' : 'rotate-180'}`} />
        </div>
        <h2 className="m-0 text-lg font-bold">{t('selectCity')}</h2>
      </div>

      <div className="p-5">
        <div className="flex flex-col gap-3">
          {GOVERNORATES.map(city => {
            const isSelected = city.id === selectedCity;
            const name = city[`name${lang.charAt(0).toUpperCase()}${lang.slice(1)}` as keyof Governorate] as string;
            return (
              <div 
                key={city.id}
                onClick={() => {
                  setSelectedCity(city.id);
                  pop();
                }}
                className={`flex items-center justify-between bg-surface px-5 py-4 rounded-2xl shadow-sm cursor-pointer border-2 ${isSelected ? 'border-primary' : 'border-transparent'}`}
              >
                <div className="flex items-center gap-3">
                  <MapPin size={20} className={isSelected ? 'text-primary' : 'text-text-secondary'} />
                  <span className={`text-base font-bold ${isSelected ? 'text-primary' : 'text-text-primary'}`}>
                    {name}
                  </span>
                </div>
                {isSelected && <Check size={20} className="text-primary" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
