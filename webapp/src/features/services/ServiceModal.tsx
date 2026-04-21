import React from 'react';
import { Translate } from '@/components/ui/Translate';
import { ServiceForm } from './ServiceForm';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceAr: string;
  serviceEn: string;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({ isOpen, onClose, serviceAr, serviceEn }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay active">
      <div className="modal modal-form" role="dialog" aria-modal="true">
        <div className="modal-header">
          <div className="modal-header-text">
            <div className="modal-title">
              <Translate ar={serviceAr} en={serviceEn} />
            </div>
            <div className="modal-subtitle">
              <Translate ar="نموذج ذكي — خطوة بخطوة" en="Smart Form — Step by Step" />
            </div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="modal-body">
          <ServiceForm defaultService={serviceAr} onSuccess={onClose} />
        </div>
      </div>
    </div>
  );
};
