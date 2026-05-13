import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { motion } from 'framer-motion';

const funnyQuotes = {
  zh: [
    '命运早已注定，你逃不掉的！😈',
    '恭喜你获得了这个完美的选择！🎉',
    '连老天都觉得这个不错~ ☁️',
    '机不可失，时不再来！⏰',
    '相信我，这是最好的结果！👍',
    '命运的齿轮开始转动... ⚙️',
    '是福不是祸，是祸躲不过！🤷',
    '选择了就不要后悔哦！😉'
  ],
  en: [
    'Destiny has spoken, you can\'t escape! 😈',
    'Congratulations on your perfect choice! 🎉',
    'Even the heavens approve! ☁️',
    'Seize the moment! ⏰',
    'Trust me, this is the best result! 👍',
    'The gears of fate are turning... ⚙️',
    'What will be will be! 🤷',
    'No regrets once chosen! 😉'
  ]
};

function DecisionCard({ result, isChinese, onClose }) {
  const cardRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [imageData, setImageData] = useState(null);

  const quote = funnyQuotes[isChinese ? 'zh' : 'en'][Math.floor(Math.random() * funnyQuotes[isChinese ? 'zh' : 'en'].length)];

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 3,
        backgroundColor: '#fef3c7',
        useCORS: true,
        filter: (node) => {
          return node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE';
        }
      });
      setImageData(dataUrl);
      setShowImage(true);
    } catch (error) {
      console.error('Failed to generate image:', error);
    }
    setIsGenerating(false);
  };

  const handleDownload = () => {
    if (imageData) {
      const link = document.createElement('a');
      link.download = `decision-${Date.now()}.png`;
      link.href = imageData;
      link.click();
    }
  };

  const handleShare = async () => {
    if (imageData && navigator.share) {
      try {
        const response = await fetch(imageData);
        const blob = await response.blob();
        const file = new File([blob], 'decision.png', { type: 'image/png' });
        const shareData = {
          title: isChinese ? '我的命运裁决' : 'My Decision',
          text: isChinese ? `我刚刚使用选择终结者做出了重要决定：${result} ${quote}` : `I just made an important decision using Decision Terminator: ${result} ${quote}`,
          files: [file]
        };
        await navigator.share(shareData);
      } catch (error) {
        console.error('Share failed:', error);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-4 text-white">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">
              {isChinese ? '🎨 手绘风裁决卡' : '🎨 Hand-drawn Decision Card'}
            </h3>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-2xl leading-none"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          {!showImage ? (
            <>
              {/* Preview Card */}
              <div
                ref={cardRef}
                className="relative bg-amber-50 rounded-xl p-6 mb-6 border-4 border-amber-200 shadow-inner"
                style={{
                  fontFamily: 'cursive, "Ma Shan Zheng", "ZCOOL KuaiLe", cursive',
                }}
              >
                {/* Decorative border */}
                <div className="absolute inset-2 border-2 border-amber-300/50 rounded-lg pointer-events-none" />
                
                {/* Stamp decoration */}
                <div className="absolute top-2 right-2 w-12 h-12 border-4 border-red-400 rounded-full flex items-center justify-center text-red-400 text-xs font-bold transform rotate-12">
                  {isChinese ? '裁决' : 'VERDICT'}
                </div>

                {/* Content */}
                <div className="relative">
                  <div className="text-center mb-4">
                    <div className="text-amber-600 text-sm mb-2" style={{ textDecoration: 'underline' }}>
                      {isChinese ? '命运的选择 · Fate Decides' : 'Fate Decides · 命运的选择'}
                    </div>
                    <h2 className="text-3xl font-bold text-amber-800 mb-2" style={{ textShadow: '2px 2px 0 rgba(0,0,0,0.1)' }}>
                      {result}
                    </h2>
                    <div className="text-amber-700 text-lg italic">
                      "{quote}"
                    </div>
                  </div>

                  {/* Hand-drawn lines */}
                  <div className="flex justify-center mt-4">
                    <svg width="120" height="30" viewBox="0 0 120 30" className="text-amber-400">
                      <path
                        d="M5,15 Q30,5 60,15 T115,15"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        style={{ strokeDasharray: '5,5' }}
                      />
                    </svg>
                  </div>

                  {/* Footer */}
                  <div className="text-center mt-4 text-amber-500 text-xs">
                    {isChinese ? '选择终结者 · XZ Terminator' : 'XZ Terminator · 选择终结者'}
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <motion.button
                onClick={handleGenerate}
                disabled={isGenerating}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {isChinese ? '正在生成...' : 'Generating...'}
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    🎨 {isChinese ? '生成手绘裁决卡' : 'Generate Hand-drawn Card'}
                  </span>
                )}
              </motion.button>
            </>
          ) : (
            <>
              {/* Generated Image */}
              <div className="bg-gray-100 rounded-xl p-4 mb-6 flex justify-center">
                <img
                  src={imageData}
                  alt="Decision Card"
                  className="max-w-full max-h-96 rounded-lg shadow-lg"
                />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  onClick={handleDownload}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                >
                  💾 {isChinese ? '保存图片' : 'Save Image'}
                </motion.button>
                <motion.button
                  onClick={handleShare}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                >
                  📤 {isChinese ? '分享' : 'Share'}
                </motion.button>
              </div>

              {/* Retry Button */}
              <motion.button
                onClick={() => setShowImage(false)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-3 py-2 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-all"
              >
                🔄 {isChinese ? '重新生成' : 'Regenerate'}
              </motion.button>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default DecisionCard;