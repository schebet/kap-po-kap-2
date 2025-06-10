import React, { useState } from 'react';
import {
  Share2,
  Facebook,
  Twitter,
  Copy,
  CheckCircle,
  MessageCircle,
  Mail,
  ExternalLink,
  Instagram,
  Linkedin,
  Send,
  Heart,
  Star,
  Users,
  Globe
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
  const [shareCount, setShareCount] = useState(127);

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
      gradient: 'from-blue-600 to-blue-700',
      shareUrl: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}&quote=${encodeURIComponent(shareData.title + ' - ' + shareData.description)}`,
      description: 'Подели на Facebook-у'
    },
    {
      name: 'Twitter',
      icon: <Twitter className="w-5 h-5" />,
      color: 'bg-sky-500 hover:bg-sky-600',
      gradient: 'from-sky-500 to-sky-600',
      shareUrl: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareData.url)}&text=${encodeURIComponent(shareData.title + ' - ' + shareData.description)}`,
      description: 'Твитуј на Twitter-у'
    },
    {
      name: 'Telegram',
      icon: <Send className="w-5 h-5" />,
      color: 'bg-blue-500 hover:bg-blue-600',
      gradient: 'from-blue-500 to-blue-600',
      shareUrl: `https://t.me/share/url?url=${encodeURIComponent(shareData.url)}&text=${encodeURIComponent(shareData.title)}`,
      description: 'Пошаљи преко Telegram-а'
    },
    {
      name: 'WhatsApp',
      icon: <MessageCircle className="w-5 h-5" />,
      color: 'bg-green-600 hover:bg-green-700',
      gradient: 'from-green-600 to-green-700',
      shareUrl: `https://wa.me/?text=${encodeURIComponent(shareData.title + ' - ' + shareData.description + ' ' + shareData.url)}`,
      description: 'Пошаљи преко WhatsApp-а'
    },
    {
      name: 'Email',
      icon: <Mail className="w-5 h-5" />,
      color: 'bg-gray-600 hover:bg-gray-700',
      gradient: 'from-gray-600 to-gray-700',
      shareUrl: `mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodeURIComponent(shareData.description + '\n\n' + shareData.url)}`,
      description: 'Пошаљи преко email-а'
    }
  ];

  const handleShare = (platform: typeof socialPlatforms[0]) => {
    window.open(platform.shareUrl, '_blank', 'width=600,height=400');
    setIsOpen(false);
    setShareCount(prev => prev + 1);
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
        setShareCount(prev => prev + 1);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  if (iconsOnly) {
    return (
      <div className="flex items-center gap-3">
        {socialPlatforms.slice(0, 4).map((platform) => (
          <button
            key={platform.name}
            onClick={() => handleShare(platform)}
            className={`group relative p-3 ${platform.color} text-white rounded-xl transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl`}
            title={platform.description}
          >
            {/* Glow effect */}
            <div className={`absolute inset-0 bg-gradient-to-r ${platform.gradient} rounded-xl opacity-0 group-hover:opacity-75 blur-lg transition-opacity duration-300`}></div>
            <div className="relative">
              {platform.icon}
            </div>
          </button>
        ))}
        <button
          onClick={handleCopyLink}
          className="group relative p-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
          title="Копирај линк"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl opacity-0 group-hover:opacity-75 blur-lg transition-opacity duration-300"></div>
          <div className="relative">
            {copied ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <Copy className="w-5 h-5" />
            )}
          </div>
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Enhanced Share Button */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative flex items-center gap-3 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-6 py-3 rounded-xl border border-white/20 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
        >
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative flex items-center gap-3">
            <div className="relative">
              <Share2 className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
              <div className="absolute inset-0 bg-blue-400 rounded-full opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-300"></div>
            </div>
            <div className="hidden sm:block">
              <span className="font-medium">Подели</span>
              <div className="flex items-center gap-1 text-xs text-white/70">
                <Users className="w-3 h-3" />
                <span>{shareCount} дељења</span>
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Enhanced Full Screen Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Animated Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
            style={{
              background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, rgba(0, 0, 0, 0.8) 100%)'
            }}
          />
          
          {/* Enhanced Share Modal */}
          <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl w-full max-w-lg mx-auto overflow-hidden">
            {/* Animated header background */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-cyan-500/20 blur-xl"></div>
            
            {/* Header */}
            <div className="relative p-6 border-b border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Share2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl blur-lg opacity-50"></div>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-xl">Подели систем</h3>
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                      <Heart className="w-4 h-4 text-red-400" />
                      <span>Помози другима да открију овај систем</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors group"
                >
                  <ExternalLink className="w-5 h-5 text-white rotate-45 group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{shareCount}</div>
                  <div className="text-xs text-white/60">Дељења</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">4.8</div>
                  <div className="text-xs text-white/60 flex items-center justify-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    Оцена
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">2.1k</div>
                  <div className="text-xs text-white/60">Корисника</div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="relative p-6">
              {/* Description */}
              <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-white/80 text-sm leading-relaxed">
                  {shareData.description}
                </p>
              </div>

              {/* Social platforms grid */}
              <div className="space-y-3 mb-6">
                <h4 className="text-white/90 text-sm font-semibold mb-4 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Изабери платформу:
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {socialPlatforms.map((platform) => (
                    <button
                      key={platform.name}
                      onClick={() => handleShare(platform)}
                      className={`group relative flex items-center gap-3 ${platform.color} text-white px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105 font-medium shadow-lg hover:shadow-xl`}
                    >
                      {/* Glow effect */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${platform.gradient} rounded-xl opacity-0 group-hover:opacity-75 blur-lg transition-opacity duration-300`}></div>
                      
                      <div className="relative flex items-center gap-3 w-full">
                        <div className="flex-shrink-0">
                          {platform.icon}
                        </div>
                        <div className="text-left min-w-0 flex-1">
                          <div className="font-medium text-sm">{platform.name}</div>
                          <div className="text-xs opacity-80 truncate">{platform.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Copy link section */}
              <div className="border-t border-white/20 pt-4 mb-4">
                <button
                  onClick={handleCopyLink}
                  className="group relative flex items-center gap-3 w-full bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105 border border-white/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-500/20 to-gray-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative flex items-center gap-3 w-full">
                    {copied ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <div className="text-left">
                          <span className="text-green-400 font-medium">Линк је копиран!</span>
                          <div className="text-xs text-green-300">Сада можете да га поделите</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5 flex-shrink-0" />
                        <div className="text-left">
                          <span className="font-medium">Копирај линк</span>
                          <div className="text-xs text-white/60">Подели директно</div>
                        </div>
                      </>
                    )}
                  </div>
                </button>
              </div>

              {/* Native share (mobile) */}
              {navigator.share && (
                <button
                  onClick={handleNativeShare}
                  className="group relative flex items-center gap-3 w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105 font-medium shadow-lg hover:shadow-xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-75 blur-lg transition-opacity duration-300"></div>
                  
                  <div className="relative flex items-center gap-3">
                    <ExternalLink className="w-5 h-5" />
                    <div className="text-left">
                      <span>Подели преко система</span>
                      <div className="text-xs opacity-80">Користи системске опције</div>
                    </div>
                  </div>
                </button>
              )}
            </div>

            {/* Enhanced Footer */}
            <div className="relative px-6 pb-6">
              <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">💡</span>
                  </div>
                  <div className="text-xs text-blue-200">
                    <div className="font-medium mb-1">Зашто поделити?</div>
                    <div className="space-y-1 text-blue-200/80">
                      <div>• Помозите другима да открију паметно баштованство</div>
                      <div>• Подржите развој отворених IoT решења</div>
                      <div>• Повежите се са заједницом баштована</div>
                    </div>
                  </div>
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
