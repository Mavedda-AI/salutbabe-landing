import React from "react";
import Image from "next/image";

const advantages = [
	{
		icon: "/window.svg",
		title: "Şeffaf Alışveriş",
		desc: "Her işlemde tam şeffaflık ve güven.",
	},
	{
		icon: "/globe.svg",
		title: "Döngüsel Moda",
		desc: "Gardırobunu yenile, sürdürülebilir yaşama katkı sağla.",
	},
	{
		icon: "/file.svg",
		title: "Kolay Satış",
		desc: "Hızlı ve kolay ürün listeleme, anında satış imkanı.",
	},
];

const Advantages = () => (
  <section className="advantages-section py-12 bg-white border-b border-neutral-200">
	<div className="max-w-7xl mx-auto px-4">
	  <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-neutral-800">
		Avantajlarımız
	  </h2>
	  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
		{advantages.map((adv, idx) => (
		  <div
			key={idx}
			className="flex flex-col items-center text-center p-6 rounded-xl shadow-sm bg-white border border-neutral-200 hover:border-blue-700 transition-all duration-300 hover:scale-105"
		  >
			<div className="mb-4 w-14 h-14 flex items-center justify-center rounded-full bg-neutral-100">
			  <Image src={adv.icon} alt={adv.title} width={32} height={32} className="w-8 h-8" />
			</div>
			<h3 className="text-lg font-semibold mb-2 text-blue-700">
			  {adv.title}
			</h3>
			<p className="text-neutral-600 text-base">{adv.desc}</p>
		  </div>
		))}
	  </div>
	</div>
  </section>
);

export default Advantages;

