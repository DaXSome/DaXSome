import Link from "next/link";
import Image from "next/image";

const Logo = () => {
  return (
    <Link className="flex items-center space-x-2" href="/">
      <Image
        src="/logo.png"
        width={32}
        height={32}
        alt="Logo"
        className="rounded-md"
      />
      <span className="text-xl font-bold">DaXSome</span>
    </Link>
  );
};

export default Logo;
