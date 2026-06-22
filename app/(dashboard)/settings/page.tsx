import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, CreditCard, Mail, User } from 'lucide-react';

export default async function SettingsPage() {
  const supabase = await createClient();

  // Get current user session
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

  // Fetch profile details
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  const isPro = profile?.plan === 'pro' || profile?.plan === 'annual';

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-[#0b1c30]">Hesap Ayarları</h2>
        <p className="text-[#5c5d64] text-sm mt-1">
          Kişisel bilgilerinizi ve faturalandırma detaylarınızı görüntüleyin.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Profile Details Card */}
        <Card className="border-[#c6c6cd] bg-white shadow-sm rounded-xl">
          <CardHeader>
            <CardTitle className="text-base font-bold text-[#0b1c30]">Profil Bilgileri</CardTitle>
            <CardDescription className="text-[#5c5d64] text-xs">
              Hesabınızla ilişkilendirilmiş temel profil bilgileri.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3 text-[#45464d] text-sm">
              <User className="w-4 h-4 text-[#0051d5]" />
              <span><strong>Ad Soyad:</strong> {profile?.full_name || 'Girilmedi'}</span>
            </div>
            <div className="flex items-center space-x-3 text-[#45464d] text-sm">
              <Mail className="w-4 h-4 text-[#0051d5]" />
              <span><strong>E-posta:</strong> {profile?.email || 'Girilmedi'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Billing Details */}
        <Card className="border-[#c6c6cd] bg-white shadow-sm rounded-xl">
          <CardHeader>
            <CardTitle className="text-base font-bold text-[#0b1c30] flex items-center justify-between">
              <span>Abonelik & Plan Durumu</span>
              {isPro ? (
                <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/20">
                  <Award className="w-3 h-3 fill-amber-500" />
                  PRO
                </span>
              ) : (
                <span className="text-[10px] bg-slate-100 text-[#76777d] font-bold px-2 py-0.5 rounded-full border border-[#c6c6cd]">
                  FREE
                </span>
              )}
            </CardTitle>
            <CardDescription className="text-[#5c5d64] text-xs">
              Mevcut aboneliğiniz ve yenileme tarihleriniz.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isPro ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-[#45464d] text-sm">
                  <CreditCard className="w-4 h-4 text-emerald-500" />
                  <span>
                    <strong>Aktif Plan:</strong> {profile.plan === 'annual' ? 'Yıllık Pro Plan' : 'Aylık Pro Plan'}
                  </span>
                </div>
                {profile.plan_expires_at && (
                  <p className="text-xs text-[#76777d] pl-7">
                    Yenilenme / Bitiş Tarihi: <strong>{new Date(profile.plan_expires_at).toLocaleDateString('tr-TR')}</strong>
                  </p>
                )}
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-lg font-medium">
                  Tebrikler! Sınırsız PDF indirme, kalıcı link paylaşımı ve AI kariyer koçu özellikleriniz aktif durumda.
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-[#45464d] text-sm">
                  Şu anda <strong className="text-[#0b1c30]">Ücretsiz (Free)</strong> planı kullanıyorsunuz.
                </p>
                <div className="p-3 bg-slate-50 border border-[#c6c6cd] text-[#5c5d64] text-xs rounded-lg space-y-1">
                  <p className="font-bold text-[#0b1c30] mb-1">Free Plan Limitleri:</p>
                  <p>• PDF indirmeleri 7 gün sonra sunucudan silinir.</p>
                  <p>• Paylaşım linkleri 7 gün sonra pasifleşerek abonelik yükseltme sayfasına yönlenir.</p>
                  <p>• AI kariyer koçu sohbeti ve pro şablonlar kullanılamaz.</p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t border-[#c6c6cd] pt-4">
            {isPro ? (
              <Button variant="outline" className="border-[#c6c6cd] text-[#45464d] hover:bg-slate-50 text-xs font-semibold">
                Faturalandırmayı Yönet (Stripe Portal)
              </Button>
            ) : (
              <Link href="/upgrade">
                <Button className="bg-[#0051d5] hover:bg-[#0051d5]/90 text-white font-bold text-xs">
                  Aylık ₺199 ile Pro'ya Yükselt
                </Button>
              </Link>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
