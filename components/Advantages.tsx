import React from "react";

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
	<section className="advantages-section py-16 bg-linear-to-r from-yellow-100 via-pink-100 to-blue-100">
		<div className="max-w-7xl mx-auto px-4">
			<h2 className="text-3xl md:text-4xl font-extrabold text-center mb-10 text-blue-700 animate-fade-in">
				Avantajlarımız
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				{advantages.map((adv, idx) => (
					<div
						key={idx}
						className="flex flex-col items-center text-center p-8 rounded-2xl shadow-xl bg-white border-4 border-pink-200 hover:border-blue-300 transition-all duration-300 hover:scale-105 animate-fade-in"
					>
						<div className="mb-4 w-16 h-16 flex items-center justify-center rounded-full bg-linear-to-r from-pink-300 via-yellow-300 to-blue-300 shadow-lg animate-bounce">
							<img src={adv.icon} alt={adv.title} className="w-10 h-10" />
						</div>
						<h3 className="text-xl font-bold mb-2 text-pink-600">
							{adv.title}
						</h3>
						<p className="text-blue-700 text-base">{adv.desc}</p>
					</div>
				))}
			</div>
		</div>
	</section>
);

export default Advantages;

