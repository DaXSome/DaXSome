import Link from "next/link";
import Logo from "@/components/Logo";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

const navLinks = [
  {
    label: "Datasets",
    href: "/datasets",
  },
  {
    label: "Visualizations",
    href: "/viz",
  },
];

const Navbar = () => {
  return (
    <header className="z-50 w-full border-b bg-white flex justify-center">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Logo />

          <nav className="hidden md:flex space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                className="transition-colors hover:text-primary"
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <SignedOut>
          <Button>
            <SignInButton />
          </Button>
        </SignedOut>
        <SignedIn>
          <div className="flex items-center justify-center gap-4">
            <UserButton />
            <Link href="/datasets/my">
              <Button className="text-white">My Datasets</Button>
            </Link>
          </div>
        </SignedIn>
      </div>
    </header>
  );
};

export default Navbar;
