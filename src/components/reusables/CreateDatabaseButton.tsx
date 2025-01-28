import React, { ReactNode } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
// import { usePathname } from "next/navigation";

interface Props {
  Icon?: ReactNode;
  title?: String;
}

const CreateDatabaseButton = ({ title, Icon }: Props) => {
  // const pathName = usePathname();

  return (
    <Link href={"/datasets/my/create"}>
      <Button className="font-semibold">
        {title && <div>{title}</div>}
        {title && <div>{Icon}</div>}
        {(!title || !Icon) && "Create New"}
      </Button>
    </Link>
  );
};

export default CreateDatabaseButton;
