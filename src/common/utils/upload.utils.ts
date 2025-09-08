import { FileTypeValidator, MaxFileSizeValidator, ParseFilePipe } from "@nestjs/common";

const audio_size = process.env.AUDIO_SIZE || 10;
const image_size = process.env.IMAGE_SIZE || 1;

export const ImageValidation = new ParseFilePipe({
    validators: [
        new MaxFileSizeValidator({ maxSize: image_size * 1024 * 1024 }),
        new FileTypeValidator({ fileType: "image/(png|jpg|jpeg|webp)" }),
    ],
});

export const OptionalImageValidation = new ParseFilePipe({
    validators: [
        new MaxFileSizeValidator({ maxSize: image_size * 1024 * 1024 }),
        new FileTypeValidator({ fileType: "image/(png|jpg|jpeg|webp)" }),
    ],
    fileIsRequired: false,
});

export const AudioValidation = new ParseFilePipe({
    validators: [
        new MaxFileSizeValidator({ maxSize: audio_size * 1024 * 1024 }),
        new FileTypeValidator({ fileType: "audio/(mpeg|wav|ogg|webm|aac)" }),
    ],
    fileIsRequired: false,
});
