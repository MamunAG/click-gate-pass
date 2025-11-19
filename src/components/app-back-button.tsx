import { useNavigate } from 'react-router';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

type props = {
    mutationIsPending: boolean,
    navigationLink: string
    isPopup?: boolean,
}

export default function AppBackButton({ mutationIsPending, isPopup, navigationLink }: props) {
    const navigator = useNavigate();
    return (
        <Button
            type="reset"
            disabled={mutationIsPending}
            onClick={() =>
                navigator(navigationLink)
            }
            variant={"outline"}
            className={cn("w-24", isPopup ? 'hidden' : '')}
        >
            Back
        </Button>
    )
}
