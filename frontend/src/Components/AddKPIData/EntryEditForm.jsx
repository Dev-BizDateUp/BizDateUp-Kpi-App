import { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { editKpiEntry } from '../../Api/Endpoints/endpoints';

function generateWeeks(year) {
    const weeks = [];

    let startDate = new Date(year, 3, 1, 0, 0, 0); // 1 April YYYY, 00:00 IST
    const endDate = new Date(year + 1, 2, 31, 0, 0, 0); // 31 March next year

    // First Sunday after 1st April
    let firstSunday = new Date(startDate);
    while (firstSunday.getDay() !== 0) {
        firstSunday.setDate(firstSunday.getDate() + 1);
    }

    weeks.push({
        week: 1,
        start: new Date(startDate),
        end: new Date(firstSunday),
        finYear: year
    });

    let weekStart = new Date(firstSunday);
    weekStart.setDate(weekStart.getDate() + 1); // Next Monday
    let weekNum = 2;

    while (weekStart <= endDate) {
        let weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);

        if (weekEnd > endDate) weekEnd = new Date(endDate);

        weeks.push({
            week: weekNum++,
            start: new Date(weekStart),
            end: new Date(weekEnd),
            finYear: year
        });

        weekStart.setDate(weekStart.getDate() + 7);
    }

    return weeks;
}
function toDateFromYMD(dateString) {
    // Expects input like "2025-04-01"
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month , day, 0, 0, 0); // local time
}

const months = [
    { name: 'April', canonic: 3 },
    { name: 'May', canonic: 4 },
    { name: 'June', canonic: 5 },
    { name: 'July', canonic: 6 },
    { name: 'August', canonic: 7 },
    { name: 'September', canonic: 8 },
    { name: 'October', canonic: 9 },
    { name: 'November', canonic: 10 },
    { name: 'December', canonic: 11 },
    { name: 'January', canonic: 0 },
    { name: 'February', canonic: 1 },
    { name: 'March', canonic: 2 },
];
function EntryEditForm({ onSuccess, entry }) {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [dispYears, setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState(entry.kpi_periods.year);
    const [selectedMonth, setSelectedMonth] = useState(entry.kpi_periods.month - 1);

    const dispWeeks = useMemo(() => generateWeeks(selectedYear), [selectedYear]);

    useEffect(() => {
        (async () => {
            // Simulating an API call to fetch years
            const currentYear = new Date().getFullYear();
            const years = Array.from({ length: 20 }, (_, i) => ({
                year: currentYear + i,
                text: `April ${currentYear + i} - March ${currentYear + i + 1}`
            }));
            setYears(years);
        })();
    }, []);

    const [canSend, setCanSend] = useState(true);


    async function onSubmit(data) {
        if (canSend) {
            setCanSend(false);

            console.log("display weeks ", dispWeeks);
            // console.log("Frequency ",entry.kpi.frequency_id)

            let body = {
                value_achieved: parseFloat(data.value) ?? 0,
                frequency_id: entry.kpi.frequency_id,
                year: parseInt(data.year) ?? null,
                month: parseInt(data.month) ?? null,
                quarter: parseFloat(data.quarter) ?? null

            };
            if (entry.kpi.frequency_id == 1) {
                const weeks = JSON.parse(data.week)
                console.log("Week selected ", weeks);
                console.log(toDateFromYMD(weeks.start_date));
                console.log(toDateFromYMD(weeks.end_date));
                body.start_date = toDateFromYMD(weeks.start_date);
                body.end_date = toDateFromYMD(weeks.end_date);
            }
            const res = await editKpiEntry(entry.id, body);
            if (res.result) {
                toast.success("Editted kpi entry");
                onSuccess();
            } else {
                toast.error(`Failed to edit kpi entry ${res.error}`);
            }
        } else {
            toast.warn("Please wait")
        }
        setCanSend(true);

    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" >
                <div className="flex flex-col gap-2 justify-stretch">
                    <label className='text-lg font-semibold'>
                        Select Year <span className='text-red-500'>*</span>
                    </label>
                    <select
                        {...register("year", { required: "Year is required" })}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        value={selectedYear}
                        className='border-2 border-gray-300 rounded-lg p-2'
                    >
                        <option disabled value="">Select Year</option>
                        {
                            dispYears.map((year, index) => (
                                <option key={index} value={year.year}>{year.text}</option>
                            ))
                        }
                    </select>
                    {
                        selectedYear > 0 &&
                        <>
                            {
                                entry.kpi.frequency_id <= 2 &&
                                <>
                                    <label className='text-lg font-semibold'>
                                        Select Month <span className='text-red-500'>*</span>
                                    </label>
                                    <select
                                        {...register("month", { required: "Month is required" })}
                                        onChange={(e) => setSelectedMonth(e.target.value)}
                                        value={selectedMonth}
                                        className='border-2 border-gray-300 rounded-lg p-2'
                                    >
                                        <option disabled value="">Select Month</option>
                                        {
                                            months.map((month, index) => (
                                                <option key={index} value={index}>{month.name} {index > 8 ? (parseInt(selectedYear) + 1) : selectedYear}</option>
                                            ))
                                        }
                                    </select>
                                </>
                            }
                            {
                                entry.kpi.frequency_id == 1 &&
                                <>
                                    <label className='text-lg font-semibold'>
                                        Select Week <span className='text-red-500'>*</span>
                                    </label>
                                    <select
                                        {...register("week", { required: "Week is required" })}
                                        className='border-2 border-gray-300 rounded-lg p-2'
                                    >
                                        <option disabled value="">Select Week</option>
                                        {
                                            dispWeeks
                                                .filter(week => week.start.getMonth() == (months[selectedMonth == undefined ? 0 : selectedMonth].canonic))
                                                .map((week, index) => (
                                                    <option
                                                        key={index}
                                                        value={JSON.stringify({
                                                            start_date: `${week.start.getFullYear()}-${(week.start.getMonth()).toString().padStart(2, '0')}-${week.start.getDate().toString().padStart(2, '0')}`,
                                                            end_date: `${week.end.getFullYear()}-${(week.end.getMonth()).toString().padStart(2, '0')}-${week.end.getDate().toString().padStart(2, '0')}`,
                                                        })}
                                                    >
                                                        Week {week.week} ({week.start.toLocaleDateString('en-IN')} - {week.end.toLocaleDateString('en-IN')})
                                                    </option>

                                                )
                                                )
                                        }
                                    </select>
                                </>

                            }
                            {
                                entry.kpi.frequency_id == 3 &&

                                <>
                                    <label className='text-lg font-semibold'>
                                        Select Quarter <span className='text-red-500'>*</span>
                                    </label>

                                    <select className='border-2 border-gray-300 rounded-lg p-2'
                                        {...register("quarter", { required: "Quarter is required" })}
                                        defaultValue={entry.kpi_periods.quarter}
                                    >
                                        <option disabled value="">Select Quarter</option>
                                        {
                                            [1, 2, 3, 4].map((q, index) => (
                                                <option key={index} value={index + 1}>Quarter {q} {months[index * 3].name} {index * 3 > 8 ? (parseInt(selectedYear) + 1) : selectedYear} to {months[index * 3 + 2].name} {index * 3 > 8 ? (parseInt(selectedYear) + 1) : selectedYear}</option>
                                            ))
                                        }
                                    </select>
                                </>
                            }
                        </>

                    }
                    <label className='text-lg font-semibold'>
                        Value achieved <span className='text-red-500'>*</span>
                    </label>
                    {entry.kpi.target === null ? (
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-4">
                                <label>
                                    <input
                                        type="radio"
                                        defaultChecked={entry.value_achieved > 0}
                                        value="yes"
                                        {...register("value", { required: "Please select Yes or No" })}
                                    /> Yes
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        defaultChecked={!(entry.value_achieved > 0)}
                                        value="no"
                                        {...register("value", { required: "Please select Yes or No" })}
                                    /> No
                                </label>
                            </div>
                            {errors.value && <span className="text-red-500">{errors.value.message}</span>}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <input
                                type="number"
                                step="any"
                                defaultValue={entry.value_achieved}
                                className='border-2 border-gray-300 rounded-lg p-2'
                                {...register("value", { required: "Value is required" })}
                                placeholder="Enter value achieved"
                            />
                            {errors.value && <span className="text-red-500">{errors.value.message}</span>}
                        </div>
                    )}
                </div>
                <input
                    type="submit"
                    value="Submit"
                    className='bg-blue-500 text-white rounded-lg my-2 p-2 cursor-pointer hover:bg-blue-600 transition-colors'
                />
            </form>
        </>
    )
}

export default EntryEditForm;