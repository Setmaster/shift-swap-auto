'use client';

import {Group, useComputedColorScheme} from "@mantine/core";
import Image from "next/image";
import shiftSwapLogo from "@/assets/logo.min.svg";
import shiftSwapLogoLight from "@/assets/logo-light.min.svg";
import shiftSwapIcon from "@/assets/icon.svg";
import {useRouter} from "next/navigation";
import {useParamsStore} from "@/lib/hooks/useParamsStore";

export default function ShiftSwapLogo(){
    const computedColorScheme = useComputedColorScheme('light', {getInitialValueInEffect: true});
    const reset = useParamsStore(state => state.resetParams);
    const router = useRouter();

    const navigateHome = () => {
        
        router.push('/');
        reset();
    }

    return (
    <>
    <Group visibleFrom="xs">
        {computedColorScheme !== 'light' && (
            <Image width={100} height={100} style={{cursor: "pointer"}} src={shiftSwapLogo.src}
                   onClick={navigateHome} alt={"text saying shift swap"}/>
        )}

        {computedColorScheme === 'light' && (
            <Image width={100} height={100} style={{cursor: "pointer"}} src={shiftSwapLogoLight.src}
                   onClick={navigateHome} alt={"text saying shift swap"}/>
        )}
    </Group>
    <Group hiddenFrom="xs">
        <Image width={25} height={25} style={{cursor: "pointer"}} src={shiftSwapIcon.src}
               onClick={navigateHome} alt={"s"}/>
    </Group>
    </>
);
}