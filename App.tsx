
import React, { useState, useRef } from 'react';
import { generateXHSContent } from './services/geminiService';
import { CopyOption, GenerationState } from './types';
import { Button } from './components/Button';
import { CopyCard } from './components/CopyCard';

const App: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [image, setImage] = useState<{ data: string; type: string } | null>(null);
  const [state, setState] = useState<GenerationState>({
    isLoading: false,
    error: null,
    results: [],
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage({
          data: reader.result as string,
          type: file.type,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!topic && !image) return;
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const results = await generateXHSContent(topic, image?.data, image?.type);
      setState({ isLoading: false, error: null, results });
      // Scroll to results on mobile
      window.scrollTo({ top: document.getElementById('results')?.offsetTop, behavior: 'smooth' });
    } catch (err: any) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: err.message || '生成失败，请稍后重试' 
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl xhs-gradient flex items-center justify-center text-white shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <span className="text-2xl font-black xhs-text-gradient tracking-tight">RedNotes AI</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Column */}
        <div className="lg:col-span-5 space-y-6">
          <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-2 h-6 xhs-gradient rounded-full inline-block"></span>
              告诉我想写什么
            </h2>
            
            <div className="space-y-6">
              {/* Image Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">上传参考图片（可选）</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl cursor-pointer transition-all flex flex-col items-center justify-center min-h-[200px] overflow-hidden group
                    ${image ? 'border-red-200 bg-red-50' : 'border-gray-200 hover:border-red-400 hover:bg-gray-50'}`}
                >
                  {image ? (
                    <div className="relative w-full h-full min-h-[200px]">
                      <img src={image.data} alt="Upload" className="w-full h-full object-cover rounded-xl" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-sm font-medium">点击更换图片</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <div className="bg-gray-100 p-4 rounded-full inline-block mb-3 group-hover:scale-110 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-gray-600">点击或拖拽上传图片</p>
                      <p className="text-xs text-gray-400 mt-1">支持 JPG, PNG, WEBP</p>
                    </div>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                />
              </div>

              {/* Topic Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">输入文案主题</label>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="例如：法式复古穿搭分享、如何做出一款超好吃的提拉米苏、周末去哪儿玩..."
                  className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all resize-none text-gray-800 placeholder:text-gray-400"
                />
              </div>

              <Button 
                onClick={handleGenerate} 
                isLoading={state.isLoading}
                className="w-full py-4 text-lg"
                disabled={!topic && !image}
              >
                AI 智能生成文案
              </Button>
            </div>
          </section>

          {state.error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 animate-shake">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">{state.error}</span>
            </div>
          )}
        </div>

        {/* Results Column */}
        <div id="results" className="lg:col-span-7">
          <div className="sticky top-24 space-y-6">
            {!state.isLoading && state.results.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 border-2 border-dashed border-gray-100 text-center flex flex-col items-center justify-center h-[600px]">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-400">生成的文案将在这里显示</h3>
                <p className="text-sm text-gray-300 mt-2">在左侧填写主题和图片并点击生成</p>
              </div>
            ) : state.isLoading ? (
              <div className="space-y-6 animate-pulse">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 h-64">
                    <div className="h-4 bg-gray-100 rounded w-1/4 mb-4"></div>
                    <div className="h-6 bg-gray-100 rounded w-3/4 mb-6"></div>
                    <div className="h-4 bg-gray-100 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-100 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="w-2 h-6 xhs-gradient rounded-full inline-block"></span>
                    为你推荐的 3 个版本
                  </h2>
                </div>
                <div className="space-y-6">
                  {state.results.map((option, idx) => (
                    <CopyCard key={idx} option={option} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer / Tip */}
      <footer className="max-w-6xl mx-auto px-4 mt-20 text-center text-gray-400 text-xs">
        <p>© 2024 RedNotes AI. 所有文案由 Gemini AI 生成，请确认后发布。</p>
      </footer>
    </div>
  );
};

export default App;
