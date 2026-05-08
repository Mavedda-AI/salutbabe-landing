import React from 'react';
import {Metadata, ResolvingMetadata} from 'next';
import Link from 'next/link';

type Props = {
  params: Promise<{ username: string }>;
};

async function getStoreData(username: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.salutbabe.com';
    const res = await fetch(`${apiUrl}/v1/user-profile/get-public-profile?username=${encodeURIComponent(username)}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.payload;
  } catch (err) {
    console.error('Error fetching store data:', err);
    return null;
  }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const username = resolvedParams.username;
  const store = await getStoreData(username);

  if (!store) {
    return {
      title: 'Mağaza Bulunamadı',
      description: 'Aradığınız mağaza mevcut değil.',
    };
  }

  const title = `${store.userNickname || store.userName} - SalutBabe Mağazası`;
  const description = `${store.userNickname || store.userName} adlı kullanıcının mağazasına göz at! Takipçi: ${store.stats?.followers || 0}, Ürün: ${store.stats?.listings || 0}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://salutbabe.com/store/${username}`,
      siteName: 'SalutBabe',
      images: [
        {
          url: store.profilePhotoUrl || 'https://salutbabe.com/logo-favicon.png',
          width: 800,
          height: 600,
        },
      ],
      locale: 'tr_TR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [store.profilePhotoUrl || 'https://salutbabe.com/logo-favicon.png'],
    },
  };
}

export default async function StorePage({ params }: Props) {
  const resolvedParams = await params;
  const username = resolvedParams.username;
  const store = await getStoreData(username);

  if (!store) {
    return (
      <main className="min-h-screen pt-32 pb-16 bg-neutral-50 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="text-pink-500 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-neutral-800 mb-4">Mağaza Bulunamadı</h1>
          <p className="text-neutral-500 mb-8">Aradığınız mağaza mevcut değil veya kaldırılmış olabilir.</p>
          <Link href="/" className="inline-block px-8 py-3 bg-pink-600 text-white rounded-full font-bold shadow-lg hover:bg-blue-600 transition">
            Anasayfaya Dön
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-24 bg-neutral-50 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-lg p-8 md:p-12">
        <div className="flex flex-col items-center text-center">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-neutral-200 mb-6 border-4 border-white shadow-xl">
            {store.profilePhotoUrl ? (
              <img src={store.profilePhotoUrl} alt={store.userNickname} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-neutral-400 bg-pink-50">
                {(store.userNickname || store.userName)?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          <h1 className="text-3xl font-black text-neutral-900 mb-2">{store.userNickname || store.userName}</h1>
          {store.store?.storeName && (
            <p className="text-xl font-medium text-pink-600 mb-4">{store.store.storeName}</p>
          )}

          {store.badges && store.badges.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {store.badges.map((badge: any, idx: number) => (
                <span key={idx} className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                  {badge.name || 'Rozet'}
                </span>
              ))}
            </div>
          )}

          <div className="flex justify-center gap-8 md:gap-16 w-full max-w-lg mb-10 pb-10 border-b border-neutral-100">
            <div className="text-center">
              <p className="text-3xl font-black text-neutral-900">{store.stats?.listings || 0}</p>
              <p className="text-sm font-bold text-neutral-400 uppercase tracking-wider">Aktif Ürün</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-neutral-900">{store.stats?.followers || 0}</p>
              <p className="text-sm font-bold text-neutral-400 uppercase tracking-wider">Takipçi</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-neutral-900">{store.stats?.rating || 0}</p>
              <p className="text-sm font-bold text-neutral-400 uppercase tracking-wider">Puan ({store.stats?.reviewCount || 0})</p>
            </div>
          </div>

          <div className="bg-blue-50 text-blue-800 p-6 rounded-2xl w-full max-w-lg mb-8">
            <p className="font-bold text-lg mb-2">Mağaza ürünlerini mobilde keşfet!</p>
            <p className="text-blue-600 mb-4">Bu mağazanın tüm ürünlerini detaylı incelemek için uygulamamızı kullanabilirsiniz.</p>
          </div>

          <Link href="/download" className="inline-block px-10 py-4 bg-neutral-900 text-white rounded-2xl font-bold shadow-xl hover:bg-pink-600 hover:shadow-pink-200 transition duration-300 transform active:scale-95 text-lg">
            Uygulamayı İndir & Görüntüle
          </Link>
        </div>
      </div>
    </main>
  );
}
