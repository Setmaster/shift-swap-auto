import { useEffect, useState } from "react";
import { getData } from "@/lib/actions/auctionActions";

export function useAuctions(activePage: number, pageSize: number) {
    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [pageCount, setPageCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getData(activePage, pageSize).then((data) => {
            setAuctions(data.results);
            setPageCount(data.pageCount);
            setLoading(false);
        });
    }, [activePage, pageSize]);

    return { auctions, pageCount, loading };
}
