
import React, { useState, useEffect, useCallback } from 'react';
import { NavBar } from './components/NavBar';
import { UploadZone } from './components/UploadZone';
import { ConfigPanel } from './components/ConfigPanel';
import { ResultDisplay } from './components/ResultDisplay';
import { Button } from './components/Button';
import { Wand2, AlertCircle, Key } from 'lucide-react';
import { ModelConfig, Gender, AgeGroup, SkinTone, FashionStyle, ModelPose, CameraView } from './types';
import { generateModelImage, fileToBase64, checkApiKey, openApiKeySelector } from './services/geminiService';

const INITIAL_CONFIG: ModelConfig = {
  gender: Gender.Female,
  ageGroup: AgeGroup.YoungAdult,
  skinTone: SkinTone.Medium,
  style: FashionStyle.ModernChic,
  pose: ModelPose.StandingConfident,
  view: CameraView.Front
};

const LoadingOverlay = ({ message }: { message: string }) => (
  <div className="absolute inset-0 z-10 bg-modera-900/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl animate-in fade-in duration-300">
    <div className="w-16 h-16 border-4 border-modera-accent border-t-transparent rounded-full animate-spin mb-4"></div>
    <p className="text-white font-serif text-lg animate-pulse">{message}</p>
    <p className="text-slate-400 text-sm mt-2">This may take a few moments for 4K rendering</p>
  </div>
);

const App: React.FC = () => {
  // State for API Key Check
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  
  // App State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [config, setConfig] = useState<ModelConfig>(INITIAL_CONFIG);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>("Initializing Studio...");
  const [error, setError] = useState<string | null>(null);

  // Initial API Key Check
  useEffect(() => {
    const verifyKey = async () => {
      const valid = await checkApiKey();
      setHasApiKey(valid);
    };
    verifyKey();
  }, []);

  const handleApiKeySelection = async () => {
    try {
        await openApiKeySelector();
        // Assume success as per instructions, but re-verify just in case logic changes
        setHasApiKey(true);
        setError(null);
    } catch (e) {
        console.error("API Key selection failed", e);
        setError("Failed to select API key.");
    }
  }

  const handleImageSelect = useCallback((file: File) => {
    if (selectedFile) {
      URL.revokeObjectURL(previewUrl!);
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError(null);
    setGeneratedImage(null); // Reset result on new upload
  }, [selectedFile, previewUrl]);

  const handleClearImage = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setGeneratedImage(null);
    setError(null);
  }, []);

  const handleGenerate = async () => {
    if (!selectedFile) return;
    if (!hasApiKey) {
        setError("API Key required. Please link your Google Cloud project.");
        return;
    }

    setIsGenerating(true);
    setError(null);
    
    // Rotate loading messages for UX
    const messages = [
      "Analyzing fabric texture...",
      "Detecting clothing geometry...",
      "Setting up studio lighting...",
      "Directing the model...",
      "Applying photorealistic render...",
      "Final polishing..."
    ];
    
    let msgIndex = 0;
    setLoadingMessage(messages[0]);
    const msgInterval = setInterval(() => {
      msgIndex = (msgIndex + 1) % messages.length;
      setLoadingMessage(messages[msgIndex]);
    }, 2000);

    try {
      const base64Image = await fileToBase64(selectedFile);
      const resultBase64 = await generateModelImage(base64Image, selectedFile.type, config);
      setGeneratedImage(resultBase64);
    } catch (err: any) {
      const errorMessage = err.message || "";
      // Handle various permission/auth errors
      if (
        errorMessage.includes("Requested entity was not found") || 
        errorMessage.includes("403") || 
        errorMessage.includes("PERMISSION_DENIED")
      ) {
          setHasApiKey(false); // Reset key state
          setError("Access denied. Please select a valid API key with proper permissions.");
      } else {
          setError(errorMessage || "An error occurred during generation.");
      }
    } finally {
      clearInterval(msgInterval);
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `modera-studio-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // API Key Selection View
  if (!hasApiKey) {
      return (
        <div className="min-h-screen bg-modera-900 text-white flex flex-col">
            <NavBar />
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-modera-800 p-8 rounded-2xl border border-modera-700 shadow-2xl text-center">
                    <div className="bg-modera-700/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Key className="w-8 h-8 text-modera-accent" />
                    </div>
                    <h2 className="text-2xl font-serif mb-2">Welcome to Modera AI</h2>
                    <p className="text-slate-400 mb-8">
                        To access our professional 4K generative engine, you need to connect your Google Cloud API key. This ensures dedicated processing power for your studio.
                    </p>
                    <Button variant="gold" onClick={handleApiKeySelection} className="w-full justify-center">
                        Connect API Key
                    </Button>
                    {error && (
                        <div className="mt-4 p-3 bg-red-900/30 border border-red-800 rounded-lg text-sm text-red-200">
                           {error}
                        </div>
                    )}
                    <div className="mt-6 pt-6 border-t border-modera-700/50">
                         <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-xs text-slate-500 hover:text-modera-accent underline">
                            Learn more about Gemini API Billing
                         </a>
                    </div>
                </div>
            </div>
        </div>
      )
  }

  // Main Studio View
  return (
    <div className="min-h-screen bg-modera-900 text-white flex flex-col font-sans selection:bg-modera-accent selection:text-modera-900">
      <NavBar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          
          {/* Left Column: Input & Config */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div>
                <h2 className="text-xl font-serif mb-4 text-slate-200">1. Input Product</h2>
                <UploadZone 
                selectedImage={selectedFile} 
                previewUrl={previewUrl} 
                onImageSelect={handleImageSelect}
                onClear={handleClearImage}
                disabled={isGenerating}
                />
            </div>

            <div className="flex-1">
                <h2 className="text-xl font-serif mb-4 text-slate-200">2. Configure Model</h2>
                <ConfigPanel 
                    config={config} 
                    setConfig={setConfig} 
                    disabled={isGenerating}
                />
            </div>

             {/* Generate Button (Mobile/Desktop sticky) */}
             <div className="sticky bottom-4 z-20 lg:relative lg:bottom-0 lg:z-0 pt-4 lg:pt-0">
                <Button 
                    onClick={handleGenerate} 
                    disabled={!selectedFile || isGenerating}
                    variant="gold"
                    className="w-full text-lg py-4 shadow-xl shadow-black/50"
                    isLoading={isGenerating}
                >
                    {!isGenerating && <Wand2 className="w-5 h-5" />}
                    {isGenerating ? "Generating Studio Photo..." : "Generate Studio Photo"}
                </Button>
                 {error && (
                    <div className="mt-4 bg-red-900/30 border border-red-800 text-red-200 p-3 rounded-lg text-sm flex items-center gap-2 animate-in slide-in-from-bottom-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {error}
                    </div>
                )}
             </div>
          </div>

          {/* Right Column: Result Preview */}
          <div className="lg:col-span-7 bg-black/20 rounded-2xl border border-modera-700/30 p-6 flex flex-col items-center justify-center min-h-[600px] relative overflow-hidden">
            
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" 
                style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)', backgroundSize: '40px 40px' }}>
            </div>

            {isGenerating && <LoadingOverlay message={loadingMessage} />}

            {!isGenerating && !generatedImage && (
                <div className="text-center max-w-md">
                    <div className="w-24 h-24 bg-modera-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <Wand2 className="w-10 h-10 text-modera-700" />
                    </div>
                    <h3 className="text-2xl font-serif text-white mb-2">Ready to Create</h3>
                    <p className="text-slate-400">
                        Upload your clothing item on the left, choose your model preferences, and let Modera AI create a professional photoshoot in seconds.
                    </p>
                </div>
            )}

            {generatedImage && !isGenerating && (
                <ResultDisplay 
                    imageUrl={generatedImage} 
                    onDownload={handleDownload} 
                    onReset={handleClearImage}
                />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
