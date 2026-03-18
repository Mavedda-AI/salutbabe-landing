import React from "react";
import Image from "next/image";

const testimonials = [
  {
	name: "Elif Yıldız",
	avatar: "https://randomuser.me/api/portraits/women/65.jpg",
	text: "Kızımın küçülen kıyafetlerini kolayca sattım, hem dolabım ferahladı hem de başka annelere faydam oldu. Çok güvenli ve pratik!",
  },
  {
	name: "Ayşe Demir",
	avatar: "https://randomuser.me/api/portraits/women/43.jpg",
	text: "Bebekler için kaliteli ikinci el ürünleri uygun fiyata bulmak harika. Platformun arayüzü çok sıcak ve kullanımı kolay.",
  },
  {
	name: "Zeynep Kaya",
	avatar: "https://randomuser.me/api/portraits/women/32.jpg",
	text: "Satış süreci çok hızlı ilerledi, güvenli ödeme sistemi sayesinde hiç endişe etmedim. Tüm annelere tavsiye ederim!",
  },
];

const Testimonials = () => (
  <section className="testimonials-section py-16 bg-pink-50">
	<div className="max-w-4xl mx-auto px-4">
	  <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-10 text-pink-600 animate-fade-in">
		Anneler Ne Diyor?
	  </h2>
	  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
		{testimonials.map((t, idx) => (
		  <div
			key={idx}
			className="flex flex-col items-center bg-white p-8 rounded-2xl shadow-lg border-2 border-yellow-100 hover:border-blue-200 transition-all animate-fade-in"
		  >
			<Image
			  src={t.avatar}
			  alt={t.name}
			  width={80}
			  height={80}
			  className="w-20 h-20 rounded-full mb-4 border-4 border-pink-200 shadow-md object-cover"
			/>
			<p className="text-blue-700 text-base mb-4">&quot;{t.text}&quot;</p>
			<span className="font-bold text-pink-600">{t.name}</span>
		  </div>
		))}
	  </div>
	</div>
  </section>
);

export default Testimonials;
