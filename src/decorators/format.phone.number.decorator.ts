import { Transform } from 'class-transformer';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { ApiException, ApiEC } from 'src/exceptions';
import { commonConstants } from '../common/constants';

export const FormatPhoneNumber = Transform(
    (req: any) => {
        const phone = req.value.toString();
        const parsed = parsePhoneNumberFromString(phone.match(/^[+]/g) ? phone : `+${phone}`);

        if (!(parsed?.country && commonConstants.supportedContries.includes(parsed.country))) {
            throw new ApiException(ApiEC.WrongPhoneNumber)
        }

        return parsed?.number;
    },
    { toClassOnly: true }
);