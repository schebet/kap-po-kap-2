import React, { useState } from 'react';
import {
  Share2,
  Facebook,
  Twitter,
  Copy,
  CheckCircle,
  MessageCircle,
  Mail,
  ExternalLink
} from 'lucide-react';

interface SocialShareButtonProps {
  url?: string;
  title?: string;
  description?: string;
  iconsOnly?: boolean;
}

const SocialShareButton: React.FC<SocialShareButtonProps> = ({
  url = window.location.href,
  title = "МОЈА БАШТА - Паметан систем за наводњавање",
  description = "Напредна контролна табла за климу и наводњавање са ESP32 технологијом. Аутоматско управљање баштом са реалним праћењем сензора.",
  iconsOnly = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareData = {
    url,
    title,
    description
  };

  const socialPlatforms = [
    {
      name: 'Facebook',
      icon: <Facebook className="w-5 h-5" />,
      color: 'bg-blue-600 hover:bg-blue-700',
      shareUrl: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}&quote=${encodeURIComponent(shareData.title + ' - ' + shareData.description)}`
    },
    {
      name: 'Twitter',
      icon: <Twitter className="w-5 h-5" />,
      color: 'bg-sky-500 hover:bg-sky-600',
      shareUrl: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareData.url)}&text=${encodeURIComponent(shareData.title + ' - ' + shareData.description)}`
    },
    {
      name: 'Email',
      icon: <Mail className="w-5 h-5" />,
      color: 'bg-gray-600 hover:bg-gray-700',
      shareUrl: `mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodeURIComponent(shareData.description + '\n\n' + shareData.url)}`
    }
  ];

  const handleShare = (platform: typeof socialPlatforms[0]) => {
    window.open(platform.shareUrl, '_blank', 'width=600,height=400');
    setIsOpen(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareData.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareData.title,
          text: shareData.description,
          url: shareData.url
        });
        setIsOpen(false);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  if (iconsOnly) {
    return (
      <div className="flex items-center gap-3">
        {socialPlatforms.map((platform) => (
          <button
            key={platform.name}
            onClick={() => handleShare(platform)}
            className={`p-3 ${platform.color} text-white rounded-xl transition-all duration-200 hover:scale-110 shadow-lg`}
            title={`Подели на ${platform.name}`}
          >
            {platform.icon}
          </button>
        ))}
        <button
          onClick={handleCopyLink}
          className="p-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-all duration-200 hover:scale-110 shadow-lg"
          title="Копирај линк"
        >
          {copied ? (
            <CheckCircle className="w-5 h-5 text-green-400" />
          ) : (
            <Copy className="w-5 h-5" />
          )}
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Share Button */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-4 py-2 rounded-xl border border-white/20 transition-all duration-300 hover:scale-105"
        >
          <Share2 className="w-5 h-5" />
          <span className="hidden sm:inline">Подели</span>
        </button>
      </div>

      {/* Full Screen Modal for Mobile and Desktop */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Share Modal - Responsive */}
          <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl w-full max-w-md mx-auto">
            {/* Header */}
            <div className="p-6 border-b border-white/20">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold text-lg">Подели систем</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Share2 className="w-5 h-5 text-white rotate-45" />
                </button>
              </div>
              <p className="text-white/70 text-sm mt-2 leading-relaxed">
                {shareData.description}
              </p>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Social platforms */}
              <div className="space-y-3 mb-6">
                <h4 className="text-white/80 text-sm font-medium mb-3">Изабери платформу:</h4>
                {socialPlatforms.map((platform) => (
                  <button
                    key={platform.name}
                    onClick={() => handleShare(platform)}
                    className={`flex items-center gap-3 w-full ${platform.color} text-white px-4 py-3 rounded-lg transition-all duration-200 hover:scale-105 font-medium`}
                  >
                    {platform.icon}
                    <span>Подели на {platform.name}</span>
                  </button>
                ))}
              </div>

              {/* Copy link */}
              <div className="border-t border-white/20 pt-4 mb-4">
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-3 w-full bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg transition-all duration-200 hover:scale-105"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 font-medium">Линк је копиран!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Копирај линк</span>
                    </>
                  )}
                </button>
              </div>

              {/* Native share (mobile) */}
              {navigator.share && (
                <button
                  onClick={handleNativeShare}
                  className="flex items-center gap-3 w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-3 rounded-lg transition-all duration-200 hover:scale-105 font-medium"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Подели преко система</span>
                </button>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 pb-6">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                <div className="text-xs text-blue-200">
                  <div className="font-medium mb-1">💡 Савет:</div>
                  <div>Подели овај систем са пријатељима који се баве баштованством!</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SocialShareButton;