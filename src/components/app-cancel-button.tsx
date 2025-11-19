/* eslint-disable @typescript-eslint/no-explicit-any */
import { PageAction } from '@/utility/page-actions';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

type props = {
    pageAction: string,
    isPending: boolean,
    form: any,
}

export default function AppCancelButton({ pageAction, isPending, form }: props) {
    return (
        <Button
            type="reset"
            disabled={isPending}
            onClick={() => {
                form.reset();
                form.clearErrors();
            }}
            variant={"outline"}
            className={cn(
                "w-24",
                pageAction === PageAction.view ? "hidden" : "",
                pageAction === PageAction.delete ? "hidden" : "", 'cursor-pointer'
            )}
            size={"sm"}
        >
            Cancel
        </Button>
    )
}
