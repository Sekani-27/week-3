
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { PROMPT_TEMPLATES } from './constants';
import { TemplateId, Tone, type CustomizationParams, type PerformanceMetrics, type Template } from './types';
import { generateDocumentation } from './services/geminiService';
import { BotIcon, CopyIcon, DownloadIcon } from './components/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const App: React.FC = () => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<TemplateId>(TemplateId.API_ENDPOINT);
  const [customizationParams, setCustomizationParams] = useState<CustomizationParams>({
    tone: Tone.FORMAL,
    language: 'JavaScript',
    maxLength: 250,
  });
  const [userInput, setUserInput] = useState('');
  const [generatedOutput, setGeneratedOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    generationTime: null,
    totalTokens: null,
  });

  const selectedTemplate = useMemo(
    () => PROMPT_TEMPLATES.find((t) => t.id === selectedTemplateId)!,
    [selectedTemplateId]
  );

  useEffect(() => {
    setUserInput('');
  }, [selectedTemplateId]);

  const handleGenerate = useCallback(async () => {
    if (!userInput.trim()) {
      setError('Input cannot be empty.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedOutput('');
    setPerformanceMetrics({ generationTime: null, totalTokens: null });

    const startTime = Date.now();
    const prompt = selectedTemplate.prompt(userInput, customizationParams);

    try {
      const response = await generateDocumentation(prompt);
      const endTime = Date.now();
      
      const outputText = response.text;
      setGeneratedOutput(outputText);
      
      setPerformanceMetrics({
        generationTime: (endTime - startTime) / 1000,
        totalTokens: response.usageMetadata?.totalTokenCount ?? null,
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [userInput, selectedTemplate, customizationParams]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <div className="container mx-auto p-4 lg:p-8">
        <Header />
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <InputPanel
            selectedTemplate={selectedTemplate}
            setSelectedTemplateId={setSelectedTemplateId}
            customizationParams={customizationParams}
            setCustomizationParams={setCustomizationParams}
            userInput={userInput}
            setUserInput={setUserInput}
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />
          <OutputPanel
            output={generatedOutput}
            isLoading={isLoading}
            error={error}
            performanceMetrics={performanceMetrics}
          />
        </main>
      </div>
    </div>
  );
};

const Header: React.FC = () => (
  <header className="text-center">
    <h1 className="text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
      TechDocs AI Generator
    </h1>
    <p className="mt-3 text-lg text-gray-400 max-w-2xl mx-auto">
      Create high-quality technical documentation in seconds. Select a template, customize the parameters, and let AI do the work.
    </p>
  </header>
);

interface InputPanelProps {
  selectedTemplate: Template;
  setSelectedTemplateId: (id: TemplateId) => void;
  customizationParams: CustomizationParams;
  setCustomizationParams: (params: CustomizationParams) => void;
  userInput: string;
  setUserInput: (input: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const InputPanel: React.FC<InputPanelProps> = ({
  selectedTemplate,
  setSelectedTemplateId,
  customizationParams,
  setCustomizationParams,
  userInput,
  setUserInput,
  onGenerate,
  isLoading,
}) => {
  const handleParamChange = <K extends keyof CustomizationParams,>(
    key: K,
    value: CustomizationParams[K]
  ) => {
    setCustomizationParams({ ...customizationParams, [key]: value });
  };
  
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg flex flex-col gap-6">
      <div>
        <label htmlFor="template" className="block text-sm font-medium text-gray-300 mb-2">1. Select a Template</label>
        <select
          id="template"
          value={selectedTemplate.id}
          onChange={(e) => setSelectedTemplateId(e.target.value as TemplateId)}
          className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {PROMPT_TEMPLATES.map((template) => (
            <option key={template.id} value={template.id}>{template.name}</option>
          ))}
        </select>
        <p className="text-xs text-gray-400 mt-2">{selectedTemplate.description}</p>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-2">2. Customize Parameters</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="tone" className="block text-xs font-medium text-gray-400 mb-1">Tone</label>
            <select
              id="tone"
              value={customizationParams.tone}
              onChange={(e) => handleParamChange('tone', e.target.value as Tone)}
              className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {Object.values(Tone).map((tone) => <option key={tone} value={tone}>{tone}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="language" className="block text-xs font-medium text-gray-400 mb-1">Language</label>
            <input
              type="text"
              id="language"
              value={customizationParams.language}
              onChange={(e) => handleParamChange('language', e.target.value)}
              className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="maxLength" className="block text-xs font-medium text-gray-400 mb-1">Max Length (words)</label>
            <input
              type="number"
              id="maxLength"
              step="50"
              min="50"
              value={customizationParams.maxLength}
              onChange={(e) => handleParamChange('maxLength', parseInt(e.target.value, 10))}
              className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="userInput" className="block text-sm font-medium text-gray-300 mb-2">3. Provide Input</label>
        <textarea
          id="userInput"
          rows={12}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder={selectedTemplate.placeholder}
          className="w-full bg-gray-900 border-gray-600 text-gray-300 rounded-md p-3 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <button
        onClick={onGenerate}
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <Spinner />
            Generating...
          </>
        ) : (
          'Generate Documentation'
        )}
      </button>
    </div>
  );
};

const Spinner: React.FC = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);


interface OutputPanelProps {
  output: string;
  isLoading: boolean;
  error: string | null;
  performanceMetrics: PerformanceMetrics;
}

const OutputPanel: React.FC<OutputPanelProps> = ({ output, isLoading, error, performanceMetrics }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-documentation.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg flex flex-col relative min-h-[500px]">
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-gray-200">Generated Output</h3>
        {output && !isLoading && (
          <div className="flex items-center gap-2">
            <button onClick={handleCopy} className="text-gray-400 hover:text-white transition p-1 rounded-md bg-gray-700 hover:bg-gray-600">
              {copied ? 'Copied!' : <CopyIcon />}
            </button>
            <button onClick={handleDownload} className="text-gray-400 hover:text-white transition p-1 rounded-md bg-gray-700 hover:bg-gray-600">
              <DownloadIcon />
            </button>
          </div>
        )}
      </div>

      <div className="p-6 overflow-y-auto flex-grow prose prose-invert prose-sm max-w-none prose-pre:bg-gray-900 prose-pre:text-gray-300">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col justify-center items-center bg-gray-800 bg-opacity-75">
            <Spinner />
            <p className="mt-4 text-gray-300">Generating documentation, please wait...</p>
          </div>
        )}
        {error && <div className="text-red-400 bg-red-900 bg-opacity-30 p-4 rounded-md">{error}</div>}
        {!isLoading && !error && !output && (
           <div className="flex flex-col justify-center items-center h-full text-center text-gray-500">
             <BotIcon className="w-16 h-16 mb-4" />
             <p className="text-lg">Your generated documentation will appear here.</p>
             <p>Fill out the form on the left and click "Generate".</p>
           </div>
        )}
        {output && <ReactMarkdown remarkPlugins={[remarkGfm]}>{output}</ReactMarkdown>}
      </div>

      {performanceMetrics.generationTime && (
        <div className="border-t border-gray-700 p-3 text-xs text-gray-400 flex justify-end gap-4">
          <span>Generation time: {performanceMetrics.generationTime.toFixed(2)}s</span>
          <span>
            {performanceMetrics.totalTokens 
              ? `Token usage: ${performanceMetrics.totalTokens}`
              : 'Token usage: N/A'
            }
          </span>
        </div>
      )}
    </div>
  );
};

export default App;
