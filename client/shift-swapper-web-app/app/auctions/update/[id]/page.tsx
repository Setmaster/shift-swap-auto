import { getAuction } from "@/lib/actions/auctionActions";
import AuctionForm from "@/components/AuctionForm/AuctionForm";

export default async function AuctionUpdatePage({ params }: { params: { id: string } }) {
    const data = await getAuction(params.id);

    return (
        <AuctionForm
            mode="update"
            auctionId={params.id}
            initialAuctionData={{
                make: data.make,
                model: data.model,
                color: data.color,
                year: String(data.year),
                mileage: String(data.mileage),
            }}
            imageUrl={data.imageUrl}
        />
    );
}
