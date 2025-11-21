import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

interface Props {
  pageName?: string;
  addNewButtonText?: string;
  isShowAddNewButton?: boolean;
  handleNavigateToAddNewPage?: React.MouseEventHandler<HTMLButtonElement>;
  children?: React.ReactNode;
}
const BreadcrumbAddNew = ({ pageName, addNewButtonText, isShowAddNewButton, handleNavigateToAddNewPage, children }: Props) => {

  return (
    <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* <h2 className="text-3xl font-semibold text-black dark:text-white">
        {pageName}
      </h2> */}
      <p></p>
      <p className="hidden">{pageName}</p>
      <div>
        <div className="flex gap-1">
          {children}
        </div>
        <div className={cn(isShowAddNewButton === false ? 'hidden' : '',)}>
          {addNewButtonText &&
            <Button variant={"outline"} className='cursor-pointer' onClick={handleNavigateToAddNewPage}>
              <Link to={'/gate-pass/new'} className="flex items-center gap-2">
                <span>{addNewButtonText}</span>
                <Plus />
              </Link>
            </Button>
          }
        </div>

      </div>
    </div>
  );
};

export default BreadcrumbAddNew;
