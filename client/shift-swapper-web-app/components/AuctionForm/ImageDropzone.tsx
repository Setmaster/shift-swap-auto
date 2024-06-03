'use client';

import {Text, Group, Button, rem, useMantineTheme, Stack} from '@mantine/core';
import {Dropzone, MIME_TYPES} from '@mantine/dropzone';
import {IconCloudUpload, IconX, IconDownload} from '@tabler/icons-react';
import {useRef, useState} from "react";
import classes from './ImageDropzone.module.css';
import Image from "next/image"
import cx from "clsx";

type ImageDropzoneProps = {
    form: any;
    emptyError: boolean;
    setImageError: (value: boolean) => void;
}

export default function ImageDropzone({form, emptyError, setImageError}: ImageDropzoneProps) {
    const theme = useMantineTheme();
    const imageRef = useRef<() => void>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);

    function handleImageDrop(files: File[]) {
        const file = files[0];
        if (!file) {
            setImageSrc(null);
            return;
        }
        const fileUrl = URL.createObjectURL(file);
        setImageSrc(fileUrl); // Update the imageSrc state with the file URL
        form.setFieldValue('image', file); // Update the form state with the file
        setImageError(false); // Clear the error as soon as an image is added
    }

    return (
        <Stack>
            <Dropzone
                openRef={imageRef}
                onDrop={handleImageDrop}
                onReject={() => setImageSrc(null)}
                className={cx(classes.dropzone, { [classes.dropzoneEmpty]: emptyError })}
                radius="md"
                accept={[MIME_TYPES.jpeg, MIME_TYPES.png]}
                maxSize={1 * 1024 ** 2} // 1mb
                aria-required={true}
            >
                {!imageSrc &&
                    <div style={{pointerEvents: 'none'}}>
                        <Group justify="center">
                            <Dropzone.Accept>
                                <IconDownload
                                    style={{width: rem(50), height: rem(50)}}
                                    color={theme.colors.blue[6]}
                                    stroke={1.5}
                                />
                            </Dropzone.Accept>
                            <Dropzone.Reject>
                                <IconX
                                    style={{width: rem(50), height: rem(50)}}
                                    color={theme.colors.red[6]}
                                    stroke={1.5}
                                />
                            </Dropzone.Reject>
                            <Dropzone.Idle>
                                <IconCloudUpload style={{width: rem(50), height: rem(50)}} stroke={1.5}/>
                            </Dropzone.Idle>
                        </Group>

                        <Text ta="center" fw={700} fz="lg" mt="xl">
                            <Dropzone.Accept>Drop files here</Dropzone.Accept>
                            <Dropzone.Reject>Image file less than 1mb</Dropzone.Reject>
                            <Dropzone.Idle>Upload image</Dropzone.Idle>
                        </Text>
                        <Text ta="center" fz="sm" mt="xs" c="dimmed">
                            Drag&apos;n&apos;drop your vehicle photo here to upload.
                        </Text>
                    </div>
                }
                {imageSrc &&
                    <Image
                        src={imageSrc}
                        alt="uploaded image"
                        style={{objectFit: "cover"}} // This ensures the image covers the area of the div
                        width={200} height={200}/>}
            </Dropzone>

            <Button className={classes.control} size="md" radius="xl" onClick={() => imageRef.current?.()}>
                Select image
            </Button>
        </Stack>
    );
}
