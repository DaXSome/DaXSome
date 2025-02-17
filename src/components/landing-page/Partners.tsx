'use client';

import Link from 'next/link';

const partners = [
    {
        name: 'SeveighTech',
        image: '/images/seveightech.jpeg',
        link: 'https://seveightech.com',
    },
];

export default function Partners() {
    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl font-extrabold text-gray-800 mb-12">
                    Our Trusted Partners
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 items-center">
                    {partners.map((partner) => (
                        <Link
                            key={partner.name}
                            href={partner.link}
                            className="flex flex-col items-center p-6 bg-white shadow-lg rounded-xl hover:shadow-2xl transition-shadow duration-300"
                        >
                            <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-primary">
                                <img
                                    src={partner.image}
                                    alt={partner.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700">
                                {partner.name}
                            </h3>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
