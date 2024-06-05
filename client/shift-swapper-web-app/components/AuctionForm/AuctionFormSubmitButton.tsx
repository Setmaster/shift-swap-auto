import { Button } from "@mantine/core";

export default function AuctionFormSubmitButton({ pending, disabled } : { pending: boolean, disabled: boolean }) {
    return (
        <Button disabled={pending || disabled} type="submit" size="md" color={"#870000"}>
            {pending ? 'Submitting...' : 'Submit Auction'}
        </Button>
    );
}
