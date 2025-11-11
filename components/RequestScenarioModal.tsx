import React, { useState } from 'react';

interface RequestScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const RequestScenarioModal: React.FC<RequestScenarioModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({ title: '', description: '', persona: '', criteria: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setIsSubmitted(true);
    setTimeout(() => {
        onClose();
        setIsSubmitted(false);
        setFormData({ title: '', description: '', persona: '', criteria: '' });
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-lg p-6 animate-fade-in" onClick={e => e.stopPropagation()}>
        {isSubmitted ? (
            <div className="text-center py-10">
                <h2 className="text-2xl font-bold text-emerald-400 mb-2">Thank you!</h2>
                <p className="text-slate-300">Your scenario idea has been submitted.</p>
            </div>
        ) : (
            <>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">Request a New Scenario</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1">Scenario Title</label>
                        <input type="text" name="title" id="title" required value={formData.title} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                        <textarea name="description" id="description" rows={2} required value={formData.description} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                    </div>
                     <div>
                        <label htmlFor="persona" className="block text-sm font-medium text-slate-300 mb-1">AI Persona</label>
                        <textarea name="persona" id="persona" rows={2} required value={formData.persona} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g., A friendly but busy hiring manager..."></textarea>
                    </div>
                     <div>
                        <label htmlFor="criteria" className="block text-sm font-medium text-slate-300 mb-1">Key things to practice</label>
                        <textarea name="criteria" id="criteria" rows={2} required value={formData.criteria} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g., Maintaining a confident tone, active listening..."></textarea>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-full transition-colors duration-200">Cancel</button>
                        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full transition-colors duration-200">Submit</button>
                    </div>
                </form>
            </>
        )}
      </div>
    </div>
  );
};