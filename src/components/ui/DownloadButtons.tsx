import React from 'react';

interface DownloadButtonsProps {
  className?: string;
  buttonClassName?: string;
}

const DownloadButtons: React.FC<DownloadButtonsProps> = ({ 
  className = "", 
  buttonClassName = "" 
}) => {
  return (
    <div className={`flex flex-col sm:flex-row gap-4 items-center ${className}`}>
      <a 
        href="#" 
        className={`inline-flex items-center ${buttonClassName}`}
      >
        <img 
          src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/fr-fr?size=250x83"
          alt="Télécharger dans l'App Store"
          className="h-[40px]"
        />
      </a>
      
      <a 
        href="#" 
        className={`inline-flex items-center ${buttonClassName}`}
      >
        <img 
          src="https://play.google.com/intl/en_us/badges/static/images/badges/fr_badge_web_generic.png"
          alt="Disponible sur Google Play"
          className="h-[52.3px]"
        />
      </a>
    </div>
  );
};

export default DownloadButtons;
