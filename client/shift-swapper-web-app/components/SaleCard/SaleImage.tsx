import Image from "next/image";
import classes from './SaleImage.module.css';


type SaleImageData = {
    id: string; // auctionId
    status: string;
    make: string;
    model: string;
    year: number;
    color: string;
    mileage: number;
    imageUrl: string;
    currentHighBid: number;
    reservePrice: number;
    auctionEnd: string;
};

type SaleImageProps = {
    data: SaleImageData;
};

export default function SaleImage({data }: SaleImageProps) {
    return (
        <Image
            className={classes.saleImage}
            src={data.imageUrl}
            alt={`${data.year} ${data.make} ${data.model}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
    );
}