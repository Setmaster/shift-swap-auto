import {useFormStatus} from 'react-dom';
import {Button} from "@mantine/core";

export default function ShareContraptionFormSubmitButton({pending} : {pending: boolean}){
    
    return (
        <Button disabled={pending} type="submit" size="md">
            {pending ? 'Submitting...' : 'Submit Auction'}
        </Button>
    );
}