import React from 'react';
import { X, Calendar, Clock, Video, CheckCircle2, ArrowUpRight, Sparkles, MapPin } from 'lucide-react';
import { AppSettings } from '../types';

interface MeetingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
}

export const MeetingsModal: React.FC<MeetingsModalProps> = ({
  isOpen,
  onClose,
  settings
}) => {
  if (!isOpen) return null;

  const handleOpenGoogleCalendar = () => {
    window.open(settings.calendarUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-gray-200 shadow-2xl p-6 sm:p-8 overflow-hidden text-left">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          <div className="space-y-2 border-b border-gray-100 pb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider border border-red-200">
              <Calendar className="w-3.5 h-3.5 text-red-600" />
              <span>Agenda Oficial Google Calendar</span>
            </div>

            <h2 className="text-2xl font-extrabold text-gray-950">
              AGENDÁ TU REUNIÓN
            </h2>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Elegí el día y horario que más te convenga para coordinar una videollamada de asesoramiento comercial o una visita a nuestro showroom en Córdoba.
            </p>
          </div>

          {/* Details list */}
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 flex items-start gap-3">
              <Clock className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-gray-950 uppercase tracking-wider">
                  Duración aproximada
                </h4>
                <p className="text-xs text-gray-600">
                  20 a 30 minutos de sesión personalizada 1 a 1.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 flex items-start gap-3">
              <Video className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-gray-950 uppercase tracking-wider">
                  Modalidad
                </h4>
                <p className="text-xs text-gray-600">
                  Google Meet (online) o presencial en Córdoba Capital.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-gray-950 uppercase tracking-wider">
                  Temas a Tratar
                </h4>
                <p className="text-xs text-gray-600">
                  Plan comercial de Dropshipping, Red de ventas o Apertura de Franquicias (Bronze a Diamond).
                </p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="space-y-2 pt-2">
            <button
              id="btn-modal-agendar-ahora"
              onClick={handleOpenGoogleCalendar}
              className="w-full py-3.5 px-6 rounded-xl bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-extrabold text-xs uppercase tracking-wider shadow-md shadow-red-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>AGENDAR EN GOOGLE CALENDAR</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl text-gray-500 hover:text-gray-900 text-xs font-bold transition-all cursor-pointer"
            >
              Volver a la aplicación
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
