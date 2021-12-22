import { Transform } from 'class-transformer';

export function TransformStringTrimLowerCase() {
    return Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value));
}
