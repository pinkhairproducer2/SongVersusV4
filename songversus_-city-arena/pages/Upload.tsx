
import React, { useState } from 'react';
import { User } from '../types';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Music, Mic2, Check, Sparkles, DollarSign } from 'lucide-react';
import { generateBattleDescription } from '../services/gemini';

interface UploadProps {
  user: User;
  onPublish: () => void;
}

const UploadPage: React.FC<UploadProps> = ({ user, onPublish }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('Trap');
  const [description, setDescription] = useState('');
  const [entryFee, setEntryFee] = useState(500);
  const [isGenerating, setIsGenerating] = useState(false);

  const battleType = user.role === 'Artist' ? 'SONG' : 'BEAT';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleGenerateDesc = async () => {
    setIsGenerating(true);
    const desc = await generateBattleDescription(genre, 'aggressive and energetic');
    setDescription(desc);
    setIsGenerating(false);
  };

  const handlePublish = () => {
    onPublish();
    // Simulate API call
    setTimeout(() => navigate('/battles'), 1000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-5xl font-display font-bold uppercase text-white mb-2 text-center">New <span className="text-neon-pink">Job</span></h1>
      <p className="text-center text-gray-400 font-mono text-sm mb-8 uppercase tracking-widest">
           Creating {battleType} Battle as {user.role}
      </p>
      
      {/* Stepper */}
      <div className="flex justify-between items-center mb-12 relative">
         <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-800 -z-10"></div>
         {[1, 2, 3].map((s) => (
             <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-hud text-xl border-2 transition-colors bg-dark-900 ${step >= s ? 'border-neon-pink text-neon-pink' : 'border-gray-700 text-gray-700'}`}>
                 {step > s ? <Check className="w-5 h-5" /> : s}
             </div>
         ))}
      </div>

      <div className="bg-dark-800 border border-white/10 p-8 shadow-2xl relative overflow-hidden">
        {step === 1 && (
            <div className="flex flex-col items-center gap-6 py-8">
                <div className="w-full h-48 border-2 border-dashed border-gray-700 rounded-none flex flex-col items-center justify-center bg-black/20 hover:border-neon-pink/50 transition-colors relative group">
                    <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="audio/*" />
                    <UploadCloud className="w-12 h-12 text-gray-500 mb-4 group-hover:text-neon-pink transition-colors" />
                    <p className="text-gray-300 font-mono text-sm uppercase tracking-widest">Drop Audio File</p>
                    <p className="text-gray-600 text-xs mt-2">MP3, WAV (Max 10MB)</p>
                    {file && <div className="mt-4 text-neon-cyan font-bold bg-black/50 px-3 py-1 border border-neon-cyan">{file.name}</div>}
                </div>
                <button 
                    disabled={!file}
                    onClick={() => setStep(2)}
                    className="w-full bg-white text-black font-display text-2xl uppercase py-3 tracking-widest disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neon-pink hover:text-white transition-colors skew-x-[-10deg]"
                >
                    <span className="skew-x-[10deg] inline-block">Next Step</span>
                </button>
            </div>
        )}

        {step === 2 && (
            <div className="space-y-6">
                <div>
                    <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Mission Title</label>
                    <input 
                        type="text" 
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="w-full bg-black border border-white/20 px-4 py-3 text-white font-display text-xl focus:border-neon-cyan outline-none"
                        placeholder="ENTER TITLE..."
                    />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Genre</label>
                        <select 
                            value={genre}
                            onChange={e => setGenre(e.target.value)}
                            className="w-full bg-black border border-white/20 px-4 py-3 text-white font-sans focus:border-neon-cyan outline-none appearance-none rounded-none"
                        >
                            <option>Trap</option>
                            <option>Hip Hop</option>
                            <option>Rock</option>
                            <option>Metal</option>
                            <option>Synthwave</option>
                        </select>
                    </div>
                     <div>
                        <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">BPM</label>
                        <input type="number" placeholder="120" className="w-full bg-black border border-white/20 px-4 py-3 text-white font-sans focus:border-neon-cyan outline-none" />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Briefing</label>
                    <div className="relative">
                        <textarea 
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="w-full bg-black border border-white/20 px-4 py-3 text-white font-sans focus:border-neon-cyan outline-none h-24 resize-none"
                            placeholder="Describe the vibe..."
                        />
                        <button 
                            onClick={handleGenerateDesc}
                            disabled={isGenerating}
                            className="absolute bottom-2 right-2 text-xs bg-neon-pink/20 text-neon-pink px-2 py-1 rounded-none border border-neon-pink/50 flex items-center gap-1 hover:bg-neon-pink/40"
                        >
                            <Sparkles className="w-3 h-3" /> {isGenerating ? 'GENERATING...' : 'AI ASSIST'}
                        </button>
                    </div>
                </div>

                <div className="flex gap-4">
                     <button onClick={() => setStep(1)} className="flex-1 border border-white/20 text-white font-hud text-xl uppercase py-2 hover:bg-white/5">Back</button>
                     <button onClick={() => setStep(3)} className="flex-[2] bg-white text-black font-hud text-xl uppercase py-2 hover:bg-neon-pink hover:text-white transition-colors">Next: Set Fee</button>
                </div>
            </div>
        )}

        {step === 3 && (
             <div className="text-center py-8 space-y-8">
                 <div className="flex justify-center">
                     <div className="w-32 h-32 rounded-full border-4 border-green-500 flex flex-col items-center justify-center bg-green-500/10 relative p-4">
                         <div className="absolute inset-0 rounded-full border-4 border-green-500 animate-pulse opacity-20"></div>
                         <span className="text-3xl font-hud text-green-500">$</span>
                         <input 
                            type="number"
                            value={entryFee}
                            onChange={(e) => setEntryFee(Math.max(0, parseInt(e.target.value) || 0))}
                            className="bg-transparent text-center font-hud text-4xl text-green-500 w-full outline-none focus:border-b border-green-500/50"
                         />
                         <span className="text-[10px] uppercase text-green-500 tracking-widest mt-1">Entry Fee</span>
                     </div>
                 </div>
                 <div>
                     <h3 className="text-3xl font-display uppercase text-white mb-2">Confirm Entry Fee</h3>
                     <p className="text-gray-400 font-mono text-sm">
                        You set the price. Opponents must pay <span className="text-green-500">${entryFee}</span> to battle you.
                     </p>
                 </div>
                 
                 <div className="flex gap-4">
                     <button onClick={() => setStep(2)} className="flex-1 border border-white/20 text-white font-hud text-xl uppercase py-2 hover:bg-white/5">Back</button>
                     <button onClick={handlePublish} className="flex-[2] bg-green-600 text-white font-hud text-xl uppercase py-2 hover:bg-green-500 transition-colors shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                         Start Job
                     </button>
                </div>
             </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;
