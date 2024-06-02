'use client';

import Image from "next/image";
import classes from './SaleImage.module.css';
import {useState} from "react";
import {LoadingOverlay} from "@mantine/core";

type SaleImageProps = {
    data: Auction;
};

export default function SaleImage({data }: SaleImageProps) {
    const [isLoading, setIsLoading] = useState(true);
    
    
    return (
        <>
        <LoadingOverlay 
            visible={isLoading}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 25 }}
            loaderProps={{ color: 'red', type: 'bars' }}
        />
        <Image
            className={classes.saleImage}
            src={data.imageUrl}
            alt={`${data.year} ${data.make} ${data.model}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            onLoadingComplete={() => setIsLoading(false)}
        />
        </>
    );
}