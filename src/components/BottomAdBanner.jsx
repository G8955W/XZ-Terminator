import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const BottomAdBanner = () => {
  const adRef = useRef(null);
  const { t } = useTranslation();

  return (
    <div className="fixed bottom-0 left-0 w-full bg-neutral-900/90 backdrop-blur-sm border-t border-neutral-800 z-[60] py-2 flex justify-center items-center shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
      <div
        id="ad-slot-bottom"
        ref={adRef}
        className="w-[320px] h-[50px] md:w-[728px] md:h-[90px] bg-neutral-800 rounded flex items-center justify-center border border-neutral-700/50"
      >
        <span className="text-neutral-500 text-xs font-mono tracking-widest uppercase">
          {t('advertisement')}
        </span>
      </div>
    </div>
  );
};

export default BottomAdBanner;