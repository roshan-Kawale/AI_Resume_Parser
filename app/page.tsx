import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BriefcaseIcon, UserIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-6xl mb-4">
            AI-Powered Talent Match
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Connecting the right talent with the right opportunities using advanced AI
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="text-center">
              <UserIcon className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-semibold mb-4">Candidates</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Submit your application and let our AI match you with the perfect opportunity
              </p>
              <Link href="/candidates/apply">
                <Button className="w-full">
                  Apply Now
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="text-center">
              <BriefcaseIcon className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-semibold mb-4">Recruiters</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Find the best candidates using our AI-powered matching system
              </p>
              <Link href="/recruiters/dashboard">
                <Button className="w-full" variant="outline">
                  Access Dashboard
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Submit Application</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Upload your resume and provide additional details
              </p>
            </div>
            <div>
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our AI analyzes your profile and matches you with relevant positions
              </p>
            </div>
            <div>
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Matched</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Receive personalized job matches and feedback
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}