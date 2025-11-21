/* eslint-disable @typescript-eslint/no-explicit-any */
import { PageAction } from '@/utility/page-actions';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

type props = {
    pageAction: string,
    mutationIsPending: boolean,
    isLoading: boolean,
}

export default function AppSaveButton({ pageAction, mutationIsPending: isPending, isLoading }: props) {
    return (
        <Button
            type="submit"
            disabled={isPending ? true : isLoading}
            className={cn(
                "w-24",
                (pageAction === PageAction.view ? "hidden" : " "), 'cursor-pointer'
            )}
            variant={
                pageAction === PageAction.delete ? "destructive" : "default"
            }
            size={"sm"}
        >
            {pageAction === PageAction.add
                ? "Save"
                : pageAction === PageAction.edit
                    ? "Update"
                    : "Delete"}

        </Button>
    )
}
