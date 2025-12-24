import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-primary text-primary-foreground mt-auto">
      <div className="max-w-[120rem] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-heading text-xl font-bold mb-4">CareerSati</h3>
            <p className="font-paragraph text-sm text-primary-foreground/80">
              Your AI-powered companion for making informed career decisions and achieving professional success.
            </p>
          </div>

          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="font-paragraph text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/explore" className="font-paragraph text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Explore Careers
                </Link>
              </li>
              <li>
                <Link to="/guidance" className="font-paragraph text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Guidance
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="font-paragraph text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="font-paragraph text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-6">
          <p className="font-paragraph text-sm text-primary-foreground/60 text-center">
            © {new Date().getFullYear()} CareerSati. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
