import React, { useState, useEffect } from 'react';
import Tesseract from 'tesseract.js';
import Fuse from 'fuse.js';
import medicineList from './medicineList.json'; // make sure path is correct

const Store = () => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fuse, setFuse] = useState(null);

  useEffect(() => {
    setFuse(new Fuse(medicineList, {
      threshold: 0.3,       // lower = more strict
      includeScore: true
    }));
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setLoading(true);

      const result = await Tesseract.recognize(file, 'eng');
      const extractedText = result.data.text;
      setText(extractedText);
      setMedicines(matchMedicines(extractedText));
      setLoading(false);
    }
  };

  const matchMedicines = (rawText) => {
    if (!fuse) return [];

    const words = rawText
      .split(/\s+/)
      .map(w => w.replace(/[^a-zA-Z]/g, ''))
      .filter(w => w.length > 3);

    const matches = new Set();

    words.forEach(word => {
      const result = fuse.search(word);
      if (result.length && result[0].score < 0.3) {
        matches.add(result[0].item);
      }
    });

    return Array.from(matches);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Upload Prescription</h2>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0 file:text-sm file:font-semibold
                   file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />

      {image && (
        <img
          src={image}
          alt="Prescription"
          className="w-full max-h-80 object-contain rounded border border-gray-200"
        />
      )}

      {loading && <p className="text-blue-600">Extracting text and matching medicines...</p>}

      {text && (
        <div>
          <h3 className="mt-4 font-medium text-gray-700">Extracted Text:</h3>
          <pre className="bg-gray-100 p-3 rounded text-sm text-gray-800 whitespace-pre-wrap">{text}</pre>
        </div>
      )}

      {!loading && medicines.length > 0 && (
        <div>
          <h3 className="mt-4 font-medium text-green-700">Detected Medicines:</h3>
          <ul className="list-disc list-inside text-gray-800">
            {medicines.map((med, idx) => (
              <li key={idx}>{med}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Store;
