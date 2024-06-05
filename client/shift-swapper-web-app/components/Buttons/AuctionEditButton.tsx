'use client';

import {Button, rem, toRgba, useMantineTheme} from "@mantine/core";
import {IconEdit} from "@tabler/icons-react";
import {useRouter} from "next/navigation";

export default function AuctionEditButton({auctionId} : {auctionId: string}) {
    const theme = useMantineTheme();
    const router = useRouter();
    return (
        <Button
            variant={"filled"}
            rightSection={<IconEdit style={{width: rem(16), height: rem(16)}}
                                    stroke={1.5}/>}
            color={"#870000"}
            onClick={
                () => {
                    router.push(`/auctions/update/${auctionId}`);
                }
            }
        >
            Edit
        </Button>
    );
}