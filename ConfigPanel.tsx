
import React from 'react';
import { ModelConfig, Gender, AgeGroup, SkinTone, FashionStyle, ModelPose, CameraView } from '../types';
import { User, Palette, Shirt, Camera, Sparkles, Eye } from 'lucide-react';

interface ConfigPanelProps {
  config: ModelConfig;
  setConfig: React.Dispatch<React.SetStateAction<ModelConfig>>;
  disabled?: boolean;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, setConfig, disabled }) => {
  
  const handleChange = (key: keyof ModelConfig, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6 p-6 bg-modera-800/50 rounded-xl border border-modera-700/50 backdrop-blur-sm">
      <h3 className="text-xl font-serif text-white mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-modera-accent" />
        Model Configuration
      </h3>

      <div className="space-y-4">
        {/* Gender */}
        <div className="space-y-2">
          <label className="text-sm text-slate-400 font-medium flex items-center gap-2">
            <User className="w-4 h-4" /> Gender
          </label>
          <select 
            disabled={disabled}
            value={config.gender} 
            onChange={(e) => handleChange('gender', e.target.value)}
            className="w-full bg-modera-900 border border-modera-700 text-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-modera-accent focus:outline-none disabled:opacity-50"
          >
            {Object.values(Gender).map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        {/* Age Group */}
        <div className="space-y-2">
          <label className="text-sm text-slate-400 font-medium flex items-center gap-2">
            <User className="w-4 h-4" /> Age Group
          </label>
          <select 
            disabled={disabled}
            value={config.ageGroup}
            onChange={(e) => handleChange('ageGroup', e.target.value)}
            className="w-full bg-modera-900 border border-modera-700 text-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-modera-accent focus:outline-none disabled:opacity-50"
          >
            {Object.values(AgeGroup).map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        {/* Skin Tone */}
        <div className="space-y-2">
          <label className="text-sm text-slate-400 font-medium flex items-center gap-2">
            <Palette className="w-4 h-4" /> Skin Tone
          </label>
          <select 
            disabled={disabled}
            value={config.skinTone}
            onChange={(e) => handleChange('skinTone', e.target.value)}
            className="w-full bg-modera-900 border border-modera-700 text-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-modera-accent focus:outline-none disabled:opacity-50"
          >
            {Object.values(SkinTone).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Style */}
        <div className="space-y-2">
          <label className="text-sm text-slate-400 font-medium flex items-center gap-2">
            <Shirt className="w-4 h-4" /> Fashion Style
          </label>
          <select 
            disabled={disabled}
            value={config.style}
            onChange={(e) => handleChange('style', e.target.value)}
            className="w-full bg-modera-900 border border-modera-700 text-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-modera-accent focus:outline-none disabled:opacity-50"
          >
            {Object.values(FashionStyle).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Pose */}
        <div className="space-y-2">
          <label className="text-sm text-slate-400 font-medium flex items-center gap-2">
            <Camera className="w-4 h-4" /> Pose
          </label>
          <select 
            disabled={disabled}
            value={config.pose}
            onChange={(e) => handleChange('pose', e.target.value)}
            className="w-full bg-modera-900 border border-modera-700 text-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-modera-accent focus:outline-none disabled:opacity-50"
          >
            {Object.values(ModelPose).map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        {/* Camera View */}
        <div className="space-y-2">
          <label className="text-sm text-slate-400 font-medium flex items-center gap-2">
            <Eye className="w-4 h-4" /> Camera View
          </label>
          <select 
            disabled={disabled}
            value={config.view}
            onChange={(e) => handleChange('view', e.target.value)}
            className="w-full bg-modera-900 border border-modera-700 text-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-modera-accent focus:outline-none disabled:opacity-50"
          >
            {Object.values(CameraView).map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
};
