import { Card, CardContent } from '@/components/ui/card';
import { ChartBar, Database, Users, Linkedin, Github } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="container mx-auto px-6 py-12">
            <div className="text-center max-w-3xl mx-auto mb-12">
                <h1 className="text-4xl font-bold text-gray-900">
                    About Daxsome
                </h1>
                <p className="text-lg text-gray-600 mt-4">
                    Empowering data-driven decision-making through seamless data
                    management, visualization, and collaboration.
                </p>
            </div>

            <div className="bg-gray-100 p-8 rounded-2xl shadow-lg text-center mb-12">
                <h2 className="text-2xl font-semibold text-gray-900">
                    Our Vision
                </h2>
                <p className="text-gray-700 mt-4">
                    We envision a world where finding meaningful datasets
                    related to Ghana and Africa is effortless, providing a
                    centralized access point for researchers, businesses, and
                    innovators.
                </p>
            </div>

            <div className="bg-gray-100 p-8 rounded-2xl shadow-lg text-center mb-12">
                <h2 className="text-2xl font-semibold text-gray-900">
                    Our Mission
                </h2>
                <p className="text-gray-700 mt-4">
                    We help researchers, businesses, and innovators by providing
                    a centralized platform for discovering, accessing, and
                    managing meaningful datasets. Our goal is to enable informed
                    decision-making, drive AI development, and unlock new
                    opportunities for growth in Ghana and Africa.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <Card>
                    <CardContent className="flex flex-col items-center p-6">
                        <Database className="text-4xl text-blue-500 mb-4" />
                        <h3 className="text-xl font-semibold">
                            Data Management
                        </h3>
                        <p className="text-gray-600 text-center mt-2">
                            Store, organize, and manage datasets effortlessly.
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex flex-col items-center p-6">
                        <ChartBar className="text-4xl text-green-500 mb-4" />
                        <h3 className="text-xl font-semibold">
                            Powerful Visualizations
                        </h3>
                        <p className="text-gray-600 text-center mt-2">
                            Create interactive charts and graphs from your data.
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex flex-col items-center p-6">
                        <Users className="text-4xl text-purple-500 mb-4" />
                        <h3 className="text-xl font-semibold">
                            Collaborative Insights
                        </h3>
                        <p className="text-gray-600 text-center mt-2">
                            Share and analyze data with your team seamlessly.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="text-center mt-12">
                <h2 className="text-2xl font-semibold text-gray-900">
                    Connect with Us
                </h2>
                <p className="text-gray-600 mt-4">
                    Follow us on social media to stay updated with the latest
                    news and developments.
                </p>
                <div className="flex justify-center gap-6 mt-6">
                    <Link
                        href="https://linkedin.com/company/daxsome"
                        target="_blank"
                        className="flex items-center gap-2 text-gray-700 hover:text-blue-700 transition"
                    >
                        <Linkedin className="w-6 h-6" /> LinkedIn
                    </Link>
                    <Link
                        href="https://github.com/daxsome"
                        target="_blank"
                        className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition"
                    >
                        <Github className="w-6 h-6" /> GitHub
                    </Link>
                </div>
            </div>
        </div>
    );
}
