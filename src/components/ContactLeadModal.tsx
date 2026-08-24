import React, { useState } from 'react';
import { X, Send, CheckCircle2, Sparkles, MessageCircle } from 'lucide-react';
import { Lead, AppSettings } from '../types';
import { StorageService, generateWhatsAppUrl } from '../services/storageService';

interface ContactLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOption?: string;
  settings: AppSettings;
  onLeadSubmitted?: (lead: Lead) => void;
}

export const ContactLeadModal: React.FC<ContactLeadModalProps> = ({
  isOpen,
  onClose,
  initialOption = 'Dropshipping Rinoxpress',
  settings,
  onLeadSubmitted
}) => {
  if (!isOpen) return null;

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Córdoba Capital');
  const [interestOption, setInterestOption] = useState(initialOption);
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [savedLead, setSavedLead] = useState<Lead | null>(null);

  const interestOptions = [
    'Dropshipping Rinoxpress',
    'Red de Consumo & Ventas',
    'Franquicia Bronze (Corner)',
    'Franquicia Silver (Isla)',
    'Franquicia Gold (Local)',
    'Franquicia Diamond (Regional)',
    'Compra Mayorista',
    'Otro / Consulta General'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !phone) {
      alert('Por favor completá al menos tu Nombre y Teléfono de contacto.');
      return;
    }

    const newLead: Lead = {
      id: 'lead-' + Date.now(),
      createdAt: new Date().toISOString(),
      fullName,
      phone,
      email: email || '',
      city: city || 'Córdoba Capital',
      interestOption,
      message: message || '',
      status: 'Nuevo'
    };

    StorageService.addLead(newLead);
    if (onLeadSubmitted) {
      onLeadSubmitted(newLead);
    }
    setSavedLead(newLead);
    setIsSubmitted(true);
  };

  const handleSendToWhatsApp = () => {
    if (!savedLead) return;
    const text = `Hola ${settings.companyName}, completé el formulario de contacto con los siguientes datos:\n\n*Nombre:* ${savedLead.fullName}\n*Teléfono:* ${savedLead.phone}\n*Email:* ${savedLead.email || 'No especificado'}\n*Ciudad:* ${savedLead.city}\n*Opción de Interés:* ${savedLead.interestOption}\n*Mensaje:* ${savedLead.message || 'Quisiera recibir la propuesta comercial completa.'}\n\nAguardo su contacto. ¡Muchas gracias!`;
    const url = generateWhatsAppUrl(settings.whatsappNumber, text);
    window.open(url, '_blank', 'noopener,noreferrer');
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

        {!isSubmitted ? (
          <div className="space-y-5">
            <div className="space-y-1 border-b border-gray-100 pb-4">
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Formulario Oficial de Postulación</span>
              </div>
              <h2 className="text-2xl font-extrabold text-gray-950">
                QUIERO INFORMACIÓN
              </h2>
              <p className="text-xs text-gray-600">
                Dejanos tus datos y un asesor de Rinoxpress se pondrá en contacto para brindarte la propuesta comercial.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Nombre y Apellido *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ej: Marcos Pérez"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-red-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Teléfono / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ej: 351 987 6543"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-red-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Ciudad / Localidad</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ej: Córdoba Capital"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-red-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Email (Opcional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-red-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Modalidad de Interés</label>
                <select
                  value={interestOption}
                  onChange={(e) => setInterestOption(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 text-xs font-semibold focus:outline-none focus:border-red-600 cursor-pointer focus:bg-white"
                >
                  {interestOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Mensaje o Consulta (Opcional)</label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Contanos tu experiencia previa o tus dudas..."
                  className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-red-600 resize-none focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-md shadow-red-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Solicitud de Información</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="py-6 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-extrabold text-gray-950">¡Solicitud Registrada!</h3>
              <p className="text-xs text-gray-600 max-w-sm mx-auto">
                Recibimos tus datos para <strong>{savedLead?.interestOption}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-700 space-y-1 max-w-sm mx-auto text-left">
              <p><strong>Nombre:</strong> {savedLead?.fullName}</p>
              <p><strong>Teléfono:</strong> {savedLead?.phone}</p>
              <p><strong>Ciudad:</strong> {savedLead?.city}</p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={handleSendToWhatsApp}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Abrir Chat de WhatsApp</span>
              </button>

              <button
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
