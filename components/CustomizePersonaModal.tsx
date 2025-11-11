import React, { useState, useEffect } from 'react';

interface CustomizePersonaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newPersona: string) => void;
  currentPersona: string;
}

export const CustomizePersonaModal: React.FC<CustomizePersonaModalProps> = ({ isOpen, onClose, onSubmit, currentPersona }) => {
  const [persona, setPersona] = useState(currentPersona);

  useEffect(() => {
    setPersona(currentPersona);
  }, [currentPersona, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(persona);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-lg p-6 animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Customize AI Persona</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white">&times;</button>
        </div>
        <p className="text-sm text-slate-400 mb-4">
            Edit the description below to change the AI's behavior. The scenario will restart with the new persona.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="persona" className="block text-sm font-medium text-slate-300 mb-1">Persona Description</label>
                <textarea 
                    name="persona" 
                    id="persona" 
                    rows={6} 
                    required 
                    value={persona} 
                    onChange={(e) => setPersona(e.target.value)} 
                    className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:ring-indigo-500 focus:border-indigo-500"
                ></textarea>
            </div>
            <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={onClose} className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-full transition-colors duration-200">Cancel</button>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full transition-colors duration-200">Apply & Restart</button>
            </div>
        </form>
      </div>
    </div>
  );
};