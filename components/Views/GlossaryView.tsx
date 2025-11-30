
import React, { useState } from 'react';
import { Key, Image as ImageIcon, Loader2, Building2, Briefcase, HardHat, ArrowRight, Plus, Equal } from 'lucide-react';
import { generateGlossaryImage } from '../../services/moonshotService';

const GlossaryView: React.FC = () => {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateImage = async () => {
    if (!apiKey && !process.env.API_KEY) {
        setShowKeyInput(true);
        return;
    }

    setLoading(true);
    setError(null);
    try {
        const imageUrl = await generateGlossaryImage(apiKey);
        setGeneratedImage(imageUrl);
    } catch (err) {
        setError("Failed to generate image. Please check your API Key or try again.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in space-y-8 pb-12">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Glossary & MPF Concepts</h2>
        <p className="text-gray-600">
            Educational resources based on the <a href="https://mfp.mpfa.org.hk/eng/mpp_glossary.jsp" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">MPFA Glossary</a> to help you understand your investment journey.
        </p>
      </div>

      {/* SECTION 1: AI Visual Concept */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
            <h3 className="text-lg font-bold text-blue-800 flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Section 1: Visualizing MPF Concepts (AI Generated)
            </h3>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-8 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center min-h-[400px]">
            {loading ? (
                <div className="text-center">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Generating infographic with Gemini Nano Banana Pro...</p>
                    <p className="text-xs text-gray-400 mt-2">This may take a few seconds.</p>
                </div>
            ) : generatedImage ? (
                <div className="w-full flex flex-col items-center">
                    <img src={generatedImage} alt="MPF Concepts Infographic" className="rounded-lg shadow-lg max-h-[600px] object-contain w-full" />
                    <button 
                        onClick={handleGenerateImage}
                        className="mt-4 text-xs text-gray-500 hover:text-blue-600 underline"
                    >
                        Regenerate Image
                    </button>
                </div>
            ) : (
                <div className="text-center max-w-md">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                        <ImageIcon size={32} />
                    </div>
                    <h4 className="text-gray-800 font-bold mb-2">Generate Visual Explanation</h4>
                    <p className="text-gray-500 text-sm mb-6">
                        Use AI to create a comprehensive infographic explaining Annualized Return, Fund Types, Risk Indicators, and Fees based on MPFA definitions.
                    </p>
                    
                    {showKeyInput && (
                        <div className="mb-4">
                            <input 
                                type="password" 
                                placeholder="Enter Gemini API Key"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2"
                            />
                        </div>
                    )}

                    <button 
                        onClick={handleGenerateImage}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2 mx-auto"
                    >
                        <Key size={16} />
                        Generate Infographic
                    </button>
                    {error && <p className="text-red-500 text-xs mt-3">{error}</p>}
                </div>
            )}
        </div>
      </div>

      {/* SECTION 2: Interactive Diagrams */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
            <h3 className="text-lg font-bold text-blue-800 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Section 2: Key Concepts & Diagrams
            </h3>
        </div>

        {/* Diagram A: Contribution Flow */}
        <div className="mb-12">
            <h4 className="text-md font-bold text-gray-700 mb-4">A. The Flow of Contributions to Accrued Benefits</h4>
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 py-6 bg-slate-50 rounded-xl border border-slate-100">
                
                {/* Box 1 */}
                <div className="bg-white border-2 border-blue-500 p-4 rounded-lg w-48 text-center shadow-sm relative">
                    <div className="text-xs uppercase font-bold text-blue-500 mb-1">Basic</div>
                    <h5 className="font-bold text-gray-800 mb-1">Mandatory Contributions</h5>
                    <p className="text-xs text-gray-500">5% Employer + 5% Employee</p>
                </div>

                <Plus className="text-gray-400 w-6 h-6" />

                {/* Box 2 */}
                <div className="bg-white border-2 border-green-500 p-4 rounded-lg w-48 text-center shadow-sm relative">
                    <div className="text-xs uppercase font-bold text-green-500 mb-1">Optional</div>
                    <h5 className="font-bold text-gray-800 mb-1">Voluntary Contributions</h5>
                    <p className="text-xs text-gray-500">Extra amounts by either party</p>
                </div>

                <ArrowRight className="text-gray-400 w-6 h-6" />

                {/* Box 3 */}
                <div className="bg-white border-2 border-purple-500 p-4 rounded-lg w-48 text-center shadow-sm relative">
                    <div className="text-xs uppercase font-bold text-purple-500 mb-1">Growth</div>
                    <h5 className="font-bold text-gray-800 mb-1">Investment Return</h5>
                    <p className="text-xs text-gray-500">Gains (or losses) from funds</p>
                </div>

                <Equal className="text-gray-400 w-6 h-6" />

                {/* Result */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-4 rounded-lg w-48 text-center shadow-md text-white">
                    <div className="text-xs uppercase font-bold text-blue-200 mb-1">Total</div>
                    <h5 className="font-bold text-lg mb-1">Accrued Benefits</h5>
                    <p className="text-xs text-blue-100">Accumulated value in account</p>
                </div>
            </div>
        </div>

        <hr className="my-8 border-gray-100" />

        {/* Diagram B: Scheme Types */}
        <div className="mb-12">
            <h4 className="text-md font-bold text-gray-700 mb-4">B. Types of MPF Schemes</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1 */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-2 bg-blue-600 w-full"></div>
                    <div className="p-6">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4">
                            <Building2 size={24} />
                        </div>
                        <h5 className="font-bold text-gray-900 mb-2">Master Trust Scheme</h5>
                        <p className="text-sm text-gray-600 mb-4">
                            Open to employees of multiple employers, self-employed persons, and personal account holders.
                        </p>
                        <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded">Most Common</span>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-2 bg-cyan-500 w-full"></div>
                    <div className="p-6">
                        <div className="w-12 h-12 bg-cyan-50 rounded-full flex items-center justify-center text-cyan-600 mb-4">
                            <Briefcase size={24} />
                        </div>
                        <h5 className="font-bold text-gray-900 mb-2">Employer Sponsored</h5>
                        <p className="text-sm text-gray-600 mb-4">
                            Membership is limited ONLY to employees of a single employer or its associated companies.
                        </p>
                        <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded">Company Specific</span>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-2 bg-amber-500 w-full"></div>
                    <div className="p-6">
                        <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 mb-4">
                            <HardHat size={24} />
                        </div>
                        <h5 className="font-bold text-gray-900 mb-2">Industry Scheme</h5>
                        <p className="text-sm text-gray-600 mb-4">
                            Specially for casual employees in high-mobility industries like Construction and Catering.
                        </p>
                        <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded">Sector Specific</span>
                    </div>
                </div>
            </div>
        </div>

        <hr className="my-8 border-gray-100" />

        {/* Key Terms */}
        <div>
            <h4 className="text-md font-bold text-gray-700 mb-4">C. Selected Key Definitions</h4>
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <dl className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                        <dt className="font-bold text-blue-700 md:text-right">Accrued benefits</dt>
                        <dd className="md:col-span-3 text-sm text-gray-600 border-b border-slate-200 pb-4">The accumulated contributions and investment returns in an MPF account.</dd>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                        <dt className="font-bold text-blue-700 md:text-right">Beneficiary</dt>
                        <dd className="md:col-span-3 text-sm text-gray-600 border-b border-slate-200 pb-4">The person(s) designated to receive the accrued benefits of a deceased scheme member.</dd>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                        <dt className="font-bold text-blue-700 md:text-right">Contribution period</dt>
                        <dd className="md:col-span-3 text-sm text-gray-600 border-b border-slate-200 pb-4">Generally means the wage period. For a casual employee in an Industry Scheme, it means the period during which the employee is employed.</dd>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                        <dt className="font-bold text-blue-700 md:text-right">Mandatory contributions</dt>
                        <dd className="md:col-span-3 text-sm text-gray-600">Contributions that employers and employees are legally required to make to an MPF scheme. Currently, it is 5% of the employee's relevant income from the employer and 5% from the employee, subject to minimum and maximum levels.</dd>
                    </div>
                </dl>
            </div>
        </div>

      </div>
    </div>
  );
};

export default GlossaryView;
