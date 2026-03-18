import React from "react";

const advantages = [
	{
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				strokeWidth={1.5}
				stroke="currentColor"
				className="w-8 h-8 text-blue-700"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M3.75 5.25v13.5A2.25 2.25 0 006 21h12a2.25 2.25 0 002.25-2.25V5.25M3.75 5.25A2.25 2.25 0 016 3h12a2.25 2.25 0 012.25 2.25M3.75 5.25h16.5"
				/>
			</svg>
		),
		title: "Transparent Shopping",
		desc: "Full transparency and trust in every transaction.",
	},
	{
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				strokeWidth={1.5}
				stroke="currentColor"
				className="w-8 h-8 text-green-700"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M12 3v2.25M12 18.75V21m6.364-15.114l-1.591 1.591M6.227 17.773l-1.591 1.591m12.728 0l-1.591-1.591M6.227 6.227l-1.591-1.591M21 12h-2.25M5.25 12H3m15.114 6.364l-1.591-1.591M6.227 6.227l-1.591-1.591"
				/>
			</svg>
		),
		title: "Circular Fashion",
		desc: "Renew your wardrobe, contribute to a sustainable lifestyle.",
	},
	{
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				strokeWidth={1.5}
				stroke="currentColor"
				className="w-8 h-8 text-pink-700"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M16.5 10.5V6.75A2.25 2.25 0 0014.25 4.5h-4.5A2.25 2.25 0 007.5 6.75v13.5A2.25 2.25 0 009.75 22.5h4.5A2.25 2.25 0 0016.5 20.25V16.5"
				/>
				<path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15.75l7.5-7.5" />
			</svg>
		),
		title: "Easy Selling",
		desc: "List your products quickly and sell instantly.",
	},
];

const Advantages = () => (
	<section className="advantages-section py-16 bg-linear-to-b from-blue-50 via-white to-pink-50 border-b border-neutral-200">
		<div className="max-w-7xl mx-auto px-4">
			<h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-neutral-800">
				Why Salutbabe?
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				{advantages.map((adv, idx) => (
					<div
						key={idx}
						className="flex flex-col items-center text-center p-8 rounded-2xl shadow-md bg-white border border-neutral-100 hover:border-blue-700 transition-all duration-300 hover:scale-105"
					>
						<div className="mb-4 w-16 h-16 flex items-center justify-center rounded-full bg-neutral-100">
							{adv.icon}
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

