import {
    FileTypeValidator,
    HttpStatus,
    MaxFileSizeValidator,
    ParseFilePipe,
    ParseFilePipeBuilder,
} from "@nestjs/common";

export const ImageValidation = new ParseFilePipe({
    validators: [
        new MaxFileSizeValidator({ maxSize: 1 * 1024 * 1024 }),
        new FileTypeValidator({ fileType: "image/(png|jpg|jpeg|webp)" }),
    ],
});

export const OptionalImageValidation = new ParseFilePipe({
    validators: [
        new MaxFileSizeValidator({ maxSize: 1 * 1024 * 1024 }),
        new FileTypeValidator({ fileType: "image/(png|jpg|jpeg|webp)" }),
    ],
    fileIsRequired: false,
});

export const AudioValidation = new ParseFilePipe({
    validators: [
        new MaxFileSizeValidator({ maxSize: 8 * 1024 * 1024 }),
        new FileTypeValidator({ fileType: "audio/(mpeg|wav|ogg|webm|aac)" }),
    ],
    fileIsRequired: false,
});
