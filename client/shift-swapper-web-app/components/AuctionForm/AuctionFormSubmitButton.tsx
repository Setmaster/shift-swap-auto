import { Button } from "@mantine/core";

export default function AuctionFormSubmitButton({ pending } : { pending: boolean }) {
    return (
        <Button disabled={pending} type="submit" size="md">
            {pending ? 'Submitting...' : 'Submit Auction'}
        </Button>
    );
}
