import { DateInput } from '@mantine/dates';
import '@mantine/dates/styles.css';
import { useState } from 'react';
export function LogDateInput() {
    const [logDate, setLogDate] = useState<Date | null>(null);

    return (
        <DateInput
        value={logDate}
        onChange={setLogDate}
        aria-label="日期"
        placeholder=""
        />
    )
}