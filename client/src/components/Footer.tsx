import { Gamepad2, Heart } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  // Update this to your repo issue URL if you want a direct "submit" link
  // Example:
  // const submitUrl = "https://github.com/ChatGPT-PythonCode/EoGuide2/issues/new?template=submit-guide.yml";
  const submitUrl =
    "https://github.com/ChatGPT-PythonCode/EoGuide2/issues/new?template=submit-guide.yml";

  return (
    <footer className="border-t border-border/50 bg-card py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Gamepad2 className="w-6 h-6 text-primary" />
              <span className="font-display font-bold text-xl text-white">
                EO Guides
              </span>
            </div>
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
              The ultimate community resource for Endless Online: Recharged.
              Find comprehensive guides for quests, classes, travel routes, and
              commands.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Categories</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/quests"
                  className="hover:text-primary transition-colors"
                >
                  Quest Guides
                </Link>
              </li>
              <li>
                <Link
                  href="/travel"
                  className="hover:text-primary transition-colors"
                >
                  Travel Routes
                </Link>
              </li>
              <li>
                <Link
                  href="/classes"
                  className="hover:text-primary transition-colors"
                >
                  Class Builds
                </Link>
              </li>
              <li>
                <Link
                  href="/commands"
                  className="hover:text-primary transition-colors"
                >
                  Game Commands
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Community</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="https://game.endless-online.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Official Game Site
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary transition-colors"
                  onClick={(e) => e.preventDefault()}
                  title="Add your Discord link"
                >
                  Discord Server
                </a>
              </li>
              <li>
                <a
                  href={submitUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Contribute
                </a>
              </li>
              <li>
                <a
                  href="admin/"
                  className="hover:text-primary transition-colors"
                >
                  Admin
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} EO Guides. Fan made site not affiliated
            with Endless Online.
          </p>
          <div className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for
            the community
          </div>
        </div>
      </div>
    </footer>
  );
}
