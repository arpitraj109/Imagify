import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { motion } from 'framer-motion';
import { AppContext } from '../context/Appcontext';

const Result = () => {
  const { generateImage } = useContext(AppContext);
  const [image, setImage] = useState(assets.sample_img_1 || '');
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    try {
      const generatedImage = await generateImage(input);
      if (generatedImage) {
        setImage(generatedImage);
        setIsImageLoaded(true);
      } else {
        console.error('No image returned from generateImage.');
      }
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onSubmit={onSubmitHandler}
      className="flex flex-col min-h-[90vh] justify-center items-center px-4"
    >
      {/* Image Display */}
      <div className="relative mb-6">
        <img src={image} alt="Generated result" className="max-w-sm rounded shadow-md" />
        <span
          className={`absolute bottom-0 left-0 h-1 bg-blue-500 ${
            loading ? 'w-full transition-all duration-[10s]' : 'w-0'
          }`}
        />
        {loading && (
          <p className="text-center text-sm mt-3 text-gray-600 animate-pulse">
            Generating image...
          </p>
        )}
      </div>

      {/* Input Form */}
      {!isImageLoaded && (
        <div className="flex w-full max-w-xl bg-neutral-500 text-white text-sm p-0.5 mt-4 rounded-full shadow-lg">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="Describe what you want to generate"
            className="flex-1 bg-transparent outline-none ml-8 placeholder-gray-300"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-zinc-900 px-10 sm:px-16 py-3 rounded-full disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate'}
          </button>
        </div>
      )}

      {/* Result Options */}
      {isImageLoaded && (
        <div className="flex gap-3 flex-wrap justify-center text-sm p-0.5 mt-8">
          <button
            onClick={() => {
              setIsImageLoaded(false);
              setInput('');
            }}
            className="border border-zinc-900 text-black px-8 py-3 rounded-full cursor-pointer hover:bg-zinc-100 transition"
          >
            Generate Another
          </button>
          <a
            href={image}
            download
            className="bg-zinc-900 text-white px-10 py-3 rounded-full cursor-pointer hover:bg-zinc-800 transition"
          >
            Download Image
          </a>
        </div>
      )}
    </motion.form>
  );
};

export default Result;
