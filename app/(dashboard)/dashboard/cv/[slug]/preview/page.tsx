'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@/lib/supabase-client';
import Link from 'next/link';
import CVPreview from '@/components/cv-builder/CVPreview';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Download, Share2, Copy, Check, MessageSquare, Send, Sparkles, AlertTriangle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CoverLetterGenerator from '@/components/cv-builder/CoverLetterGenerator';
import JobMatcher from '@/components/cv-builder/JobMatcher';

interface PreviewCVPageProps {
  params: Promise<{ slug: string }>;
}

export default function PreviewCVPage({ params }: PreviewCVPageProps) {
  const router = useRouter();
  const { slug } = use(params);
  const supabase = createClientComponentClient();

  const [cv, setCv] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Link Sharing States
  const [targetCompany, setTargetCompany] = useState('');
  const [generatingLink, setGeneratingLink] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [linkExpires, setLinkExpires] = useState<string | null>(null);

  // AI Career Coach States
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'coach'; text: string }>>([
    { sender: 'coach', text: 'Merhaba! Ben sizin kişisel kariyer koçunuzum. Özgeçmişinizi inceledim. Mülakat hazırlığı, kariyer tavsiyeleri veya CV iyileştirmesi hakkında bana istediğinizi sorabilirsiniz!' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch profile
      const { data: profData } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', user.id)
        .single();
      setProfile(profData);

      // Fetch CV
      const { data, error } = await supabase
        .from('cvs')
        .select('*')
        .eq('id', slug)
        .eq('user_id', user.id)
        .single();

      if (error || !data) {
        alert('Özgeçmiş bulunamadı.');
        router.push('/dashboard');
        return;
      }

      setCv(data);
      if (data.is_public && data.slug) {
        setShareLink(`${window.location.origin}/cv/${data.slug}`);
        setLinkExpires(data.link_expires_at);
      }
      setLoading(false);
    }
    loadData();
  }, [slug, supabase, router]);

  const isPro = profile?.plan === 'pro' || profile?.plan === 'annual';

  // 1. Generate Sharing Link
  const handleGenerateLink = async () => {
    setGeneratingLink(true);
    try {
      const response = await fetch('/api/cv/generate-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cvId: slug,
          targetCompany: targetCompany.trim() || undefined
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Paylaşım linki oluşturulamadı.');
      }

      const result = await response.json();
      setShareLink(result.link);
      setLinkExpires(result.expiresAt);

      // Update local CV state
      setCv((prev: any) => ({
        ...prev,
        is_public: true,
        slug: result.link.split('/').pop(),
        link_expires_at: result.expiresAt
      }));
    } catch (err: any) {
      alert(err.message || 'Bir hata oluştu.');
    } finally {
      setGeneratingLink(false);
    }
  };

  // 2. Copy Link to Clipboard
  const handleCopy = () => {
    if (!shareLink) return;
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 3. Send message to AI Career Coach
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || sendingMessage) return;

    if (!isPro) {
      alert('Yapay zeka kariyer koçu sohbeti sadece PRO üyeler için geçerlidir.');
      return;
    }

    const userMsg = inputMessage;
    setInputMessage('');
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setSendingMessage(true);

    try {
      const response = await fetch('/api/ai/career-coach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMsg,
          cvData: cv.data
        })
      });

      if (!response.ok) {
        throw new Error('Yanıt alınamadı.');
      }

      const result = await response.json();
      setMessages(prev => [...prev, { sender: 'coach', text: result.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'coach', text: 'Koç ile bağlantı kurulurken bir hata oluştu. Lütfen tekrar deneyin.' }]);
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-[#76777d]">
        <div className="w-8 h-8 border-4 border-[#0051d5] border-t-transparent rounded-full animate-spin mb-4" />
        <span className="font-semibold">Özgeçmiş Hazırlanıyor...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Top Navigation */}
      <div className="flex items-center justify-between border-b border-[#c6c6cd]/50 pb-4">
        <div className="flex items-center space-x-3">
          <Link href={`/dashboard/cv/${slug}/edit`}>
            <Button variant="ghost" size="icon" className="text-[#45464d] hover:text-[#0051d5] hover:bg-[#eff4ff] border border-[#c6c6cd]">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h2 className="text-xl font-bold text-[#0b1c30]">{cv.title} — Önizleme & Paylaşım</h2>
        </div>

        <a href={cv.pdf_url || `/api/cv/generate-pdf?cvId=${slug}`} target="_blank" rel="noopener noreferrer">
          <Button className="bg-[#0051d5] hover:bg-[#316bf3] text-white font-semibold gap-2 shadow-md shadow-[#0051d5]/20">
            <Download className="w-4 h-4" />
            PDF İndir
          </Button>
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Actions, Link generation & Coach */}
        <div className="lg:col-span-5 space-y-6">
          {/* Share Link Card */}
          <Card className="border-[#c6c6cd] bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold text-[#0b1c30] flex items-center gap-1.5">
                <Share2 className="w-4.5 h-4.5 text-[#0051d5]" />
                Paylaşım Linki Oluştur
              </CardTitle>
              <CardDescription className="text-[#76777d] text-xs font-medium">
                Özgeçmişinizi mülakat uzmanlarına ve işe alım yöneticilerine göndermek için benzersiz bir web bağlantısı üretin.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {shareLink ? (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      readOnly
                      value={shareLink}
                      className="bg-[#f8f9ff] border-[#c6c6cd] text-[#0051d5] font-mono text-xs select-all focus-visible:ring-[#0051d5]/20"
                    />
                    <Button onClick={handleCopy} size="icon" className="bg-[#0051d5] hover:bg-[#316bf3] shrink-0 h-9 w-9 text-white shadow-sm">
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>

                  {linkExpires ? (
                    <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-xs text-orange-800 flex items-start gap-2 shadow-sm">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-orange-500" />
                      <div>
                        <p className="font-bold text-orange-900">Geçici Link Aktif</p>
                        <p className="mt-0.5 font-medium text-orange-700">
                          Bu link <strong>14 gün sonra ({new Date(linkExpires).toLocaleDateString('tr-TR')})</strong> pasif hale gelerek ziyaretçileri üyelik yükseltme sayfasına yönlendirecektir. Linki kalıcı yapmak için Pro plana geçin.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium shadow-sm">
                      ✨ Bu link **kalıcıdır** ve süresi asla dolmaz (PRO Plan).
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs text-[#0b1c30] font-bold">Hedef Şirket (Özel slug için isteğe bağlı)</label>
                    <Input
                      placeholder="Örn: Teknoloji Şirketi"
                      value={targetCompany}
                      onChange={(e) => setTargetCompany(e.target.value)}
                      className="bg-[#f8f9ff] border-[#c6c6cd] text-[#0b1c30] text-xs focus-visible:ring-[#0051d5]"
                    />
                  </div>
                  <Button
                    onClick={handleGenerateLink}
                    disabled={generatingLink}
                    className="w-full bg-[#0051d5] hover:bg-[#316bf3] text-white font-bold text-xs py-2 shadow-sm shadow-[#0051d5]/20"
                  >
                    {generatingLink ? 'Link Oluşturuluyor...' : 'Bağlantı Linkini Oluştur'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Career Tools Tabs Card */}
          <Tabs defaultValue="coach" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-[#f8f9ff] border border-[#c6c6cd] shadow-inner rounded-xl p-1 mb-4">
              <TabsTrigger value="coach" className="text-xs font-semibold py-1.5 rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#0051d5] data-[state=active]:shadow-sm">Kariyer Koçu</TabsTrigger>
              <TabsTrigger value="cover-letter" className="text-xs font-semibold py-1.5 rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#0051d5] data-[state=active]:shadow-sm">Ön Yazı</TabsTrigger>
              <TabsTrigger value="job-match" className="text-xs font-semibold py-1.5 rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#0051d5] data-[state=active]:shadow-sm">İş Eşleştirme</TabsTrigger>
            </TabsList>

            {/* AI Career Coach Tab */}
            <TabsContent value="coach">
              <Card className="border-[#c6c6cd] bg-white shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold text-[#0b1c30] flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <MessageSquare className="w-4.5 h-4.5 text-[#7073ff]" />
                      AI Kariyer Koçu
                    </span>
                    {!isPro && (
                      <span className="text-[9px] bg-[#eff4ff] text-[#0051d5] border border-[#0051d5]/20 px-2 py-0.5 rounded-full uppercase font-black shrink-0">
                        Pro Özellik 🔒
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription className="text-[#76777d] text-xs font-medium">
                    Özgeçmişinize özel kariyer hedefleri belirleyin, mülakat hazırlığı yapın ve koçunuzdan tavsiyeler alın.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 border-t border-[#c6c6cd]/50">
                  {isPro ? (
                    <div className="flex flex-col h-[350px]">
                      {/* Chat logs */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
                        {messages.map((msg, idx) => (
                          <div
                            key={idx}
                            className={`p-2.5 rounded-xl max-w-[85%] ${msg.sender === 'user'
                                ? 'bg-[#0051d5] text-white ml-auto'
                                : 'bg-[#f8f9ff] border border-[#c6c6cd] text-[#45464d]'
                              }`}
                          >
                            <p className="leading-relaxed whitespace-pre-line font-medium">{msg.text}</p>
                          </div>
                        ))}
                        {sendingMessage && (
                          <div className="p-2.5 rounded-xl bg-[#f8f9ff] border border-[#c6c6cd] text-[#45464d] w-fit flex items-center space-x-1.5">
                            <div className="w-1.5 h-1.5 bg-[#7073ff] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-1.5 h-1.5 bg-[#7073ff] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-1.5 h-1.5 bg-[#7073ff] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        )}
                      </div>
                      {/* Input field */}
                      <form onSubmit={handleSendMessage} className="p-3 border-t border-[#c6c6cd]/50 flex gap-2">
                        <Input
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          placeholder="Sorunuzu buraya yazın..."
                          disabled={sendingMessage}
                          className="bg-[#f8f9ff] border-[#c6c6cd] text-[#0b1c30] text-xs h-8 flex-1 focus-visible:ring-[#0051d5]"
                        />
                        <Button type="submit" disabled={sendingMessage || !inputMessage.trim()} size="icon" className="h-8 w-8 bg-[#0051d5] hover:bg-[#316bf3] text-white">
                          <Send className="w-3.5 h-3.5" />
                        </Button>
                      </form>
                    </div>
                  ) : (
                    <div className="p-6 text-center space-y-4">
                      <div className="w-10 h-10 rounded-xl bg-[#eff4ff] border border-[#0051d5]/20 flex items-center justify-center text-[#0051d5] mx-auto shadow-sm">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-[#0b1c30]">Kariyer Koçunu Etkinleştirin</h5>
                        <p className="text-xs text-[#76777d] mt-1 max-w-xs mx-auto font-medium">
                          Özgeçmişinizden yola çıkarak size özel mülakat tavsiyeleri veren yapay zeka koçuyla görüşmek için Pro'ya yükseltin.
                        </p>
                      </div>
                      <Link href="/upgrade">
                        <Button size="sm" className="bg-[#0051d5] hover:bg-[#316bf3] text-white font-bold text-xs mt-2 shadow-sm shadow-[#0051d5]/20">
                          Aylık ₺300'a Abone Ol
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* AI Cover Letter Tab */}
            <TabsContent value="cover-letter">
              <CoverLetterGenerator cvId={cv.id} cvSlug={cv.slug || cv.id} cvData={cv.data} isPro={isPro} />
            </TabsContent>

            {/* AI Job Matching Tab */}
            <TabsContent value="job-match">
              {isPro ? (
                <JobMatcher cvData={cv.data} isPro={isPro} />
              ) : (
                <Card className="border-[#c6c6cd] bg-white shadow-sm">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-[#eff4ff] border border-[#0051d5]/20 flex items-center justify-center text-[#0051d5] mx-auto shadow-sm">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-[#0b1c30]">İş İlanı Eşleştirmeyi Etkinleştirin</h5>
                      <p className="text-xs text-[#76777d] mt-1 max-w-xs mx-auto font-medium">
                        İlan detaylarını yapıştırarak CV'nizin uyumluluk yüzdesini, eksik yeteneklerinizi ve iyileştirme tavsiyelerini raporlamak için Pro'ya yükseltin.
                      </p>
                    </div>
                    <Link href="/upgrade">
                      <Button size="sm" className="bg-[#0051d5] hover:bg-[#316bf3] text-white font-bold text-xs mt-2 shadow-sm shadow-[#0051d5]/20">
                        Aylık ₺300'a Abone Ol
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Side: Render CV preview */}
        <div className="lg:col-span-7 bg-[#f8f9ff] p-4 sm:p-6 rounded-2xl border border-[#c6c6cd]/50 shadow-inner overflow-y-auto max-h-[85vh] sticky top-24">
          <p className="text-[10px] text-[#76777d] uppercase tracking-widest font-bold mb-4">Önizleme Tuvali (A4 Düzeni)</p>
          <CVPreview data={cv.data} template={cv.template} />
        </div>
      </div>
    </div>
  );
}
