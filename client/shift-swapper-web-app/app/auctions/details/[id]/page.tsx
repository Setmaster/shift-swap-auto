export default function AuctionDetailsPage({params}: {params: {id: string}}) {
    return (
        <div>
            <h1>Details for {params.id}</h1>
        </div>
    )
}