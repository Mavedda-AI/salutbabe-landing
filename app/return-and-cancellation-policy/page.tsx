import React from "react";

export default function ReturnAndCancellationPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto pt-28 pb-20 px-4">
      <div className="bg-white/80 rounded-2xl shadow-md border border-neutral-100 p-8 backdrop-blur-sm">
        <h1 className="text-4xl font-extrabold mb-8 text-blue-700 tracking-tight">İade ve İptal Koşulları</h1>
        
        <p className="text-neutral-700 text-lg mb-8 leading-relaxed">
          Salutbabe olarak müşteri memnuniyetini en üst düzeyde tutmayı hedefliyoruz. Satın aldığınız hizmetlerle ilgili iade ve iptal süreçlerimiz aşağıda detaylandırılmıştır.
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-neutral-800">1. İptal Koşulları</h2>
          <div className="space-y-4 text-neutral-700 leading-relaxed">
            <p>
              Siparişleriniz, hizmet henüz sağlanmaya başlanmadan önce iptal edilebilir. İptal talebinizi iletmek için <a href="mailto:destek@salutbabe.com" className="text-blue-600 hover:underline font-medium">destek@salutbabe.com</a> adresine e-posta gönderebilirsiniz.
            </p>
            <p>
              İptal talebi onaylandığında, ödenen tutarın tamamı ödeme yönteminize bağlı olarak 7-10 iş günü içerisinde iade edilir.
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-neutral-800">2. İade Koşulları (Cayma Hakkı)</h2>
          <div className="space-y-4 text-neutral-700 leading-relaxed">
            <p>
              6502 sayılı Tüketicinin Korunması Hakkında Kanun gereğince, tüketiciler hizmetin ifasına başlanmamış olması kaydıyla 14 gün içerisinde cayma hakkını kullanabilirler.
            </p>
            <p>
              Dijital içeriklerin veya anında ifa edilen hizmetlerin (örneğin premium üyelik avantajlarının kullanılması) tesliminden sonra cayma hakkı kullanılamaz.
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-neutral-800">3. İade Süreci</h2>
          <div className="space-y-4 text-neutral-700 leading-relaxed">
            <p>
              Onaylanan iade işlemleri, ödemenin yapıldığı kredi kartına veya banka hesabına geri aktarılır. Bankanızın süreçlerine bağlı olarak tutarın hesabınıza yansıması değişiklik gösterebilir.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-neutral-800">4. İletişim</h2>
          <p className="text-neutral-700 leading-relaxed">
            Her türlü iade ve iptal sorunuz için bize <a href="mailto:destek@salutbabe.com" className="text-blue-600 hover:underline font-medium">destek@salutbabe.com</a> üzerinden ulaşabilirsiniz.
          </p>
        </section>
      </div>
    </main>
  );
}
