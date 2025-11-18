import React, { useState, useEffect, useRef } from 'react';

interface AddItemFormProps {
  onAddItem: (itemName: string) => void;
  isAdding: boolean;
}

const MicIcon = ({ isListening }: { isListening: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isListening ? 'text-red-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
);

const Loader = () => (
    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
);

const AddItemForm: React.FC<AddItemFormProps> = ({ onAddItem, isAdding }) => {
  const [itemName, setItemName] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setItemName(transcript);
      };
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
      } else {
        alert("Sorry, your browser doesn't support voice input.");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (itemName.trim()) {
      onAddItem(itemName.trim());
      setItemName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        placeholder="e.g., Milk, Bread, Eggs..."
        className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-gray-900 placeholder-gray-500"
        disabled={isAdding}
      />
      {recognitionRef.current && (
        <button
          type="button"
          onClick={toggleListen}
          className="p-3 border border-gray-300 rounded-lg hover:bg-gray-100 flex items-center justify-center"
          disabled={isAdding}
        >
          <MicIcon isListening={isListening} />
        </button>
      )}
      <button
        type="submit"
        className="bg-blue-500 text-white font-bold px-5 py-3 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 flex items-center justify-center w-24"
        disabled={isAdding || !itemName.trim()}
      >
        {isAdding ? <Loader /> : 'Add'}
      </button>
    </form>
  );
};

export default AddItemForm;