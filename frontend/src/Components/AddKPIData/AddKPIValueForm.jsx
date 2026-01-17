import { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { addNewEntry } from '../../Api/Endpoints/endpoints';
import { ToastContainer, toast } from 'react-toastify'

function generateWeeks(year) {
    const weeks = [];

    // Financial year starts April 1 of the given year
    let startDate = new Date(year, 3, 1); // April = 3 (0-indexed)
    const endDate = new Date(year + 1, 2, 31); // March 31 next year

    // Week 1: April 1 to next Sunday
    let firstSunday = new Date(startDate);
    while (firstSunday.getDay() !== 0) {
        firstSunday.setDate(firstSunday.getDate() + 1);
    }

    weeks.push({
        week: 1,
        start: new Date(startDate),
        end: new Date(firstSunday)
    });

    // Following weeks: Monday to Sunday
    let weekStart = new Date(firstSunday);
    weekStart.setDate(weekStart.getDate() + 1); // move to Monday after first Sunday
    let weekNum = 2;

    while (weekStart <= endDate) {
        let weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);

        if (weekEnd > endDate) weekEnd = new Date(endDate);

        weeks.push({
            week: weekNum++,
            start: new Date(weekStart),
            end: new Date(weekEnd)
        });

        weekStart.setDate(weekStart.getDate() + 7);
    }

    return weeks;
}

function AddKPIValueForm({ empID, kpi, onFormSubmit }) {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const [dispYears, setYears] = useState([]);
    // const [dispWeeks, setDisplayWeeks] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(0);
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
    const dispWeeks = useMemo(() => generateWeeks(selectedYear), [selectedYear]);

    useEffect(() => {
        (async () => {
            // Simulating an API call to fetch years
            const currentYear = new Date().getFullYear();
            const years = Array.from({ length: 20 }, (_, i) => ({
                year: (currentYear - 1) + i,
                text: `April ${(currentYear - 1) + i} - March ${(currentYear - 1) + i + 1}`
            }));
            setYears(years);
        })();
    }, []);

    const [canSend, setCanSend] = useState(true);

    async function onSubmit(data) {
        if (canSend) {
            setCanSend(false)
            try {
                const info = {
                    year: parseInt(data.year), // required, financial year, 2025 for 2025-2026
                    month: parseInt(data.month) + 1, // required, 1 for April to 12 for March
                    employee_id: empID,
                    quarter: parseInt(data.quarter) ?? null, // required, 1 for Q1, 2 for Q2, 3 for Q3, 4 for Q4
                    start_date: data.week ? (JSON.parse(data.week)).start : null, // required, start date of the week/month/quarter
                    end_date: data.week ? (JSON.parse(data.week)).end : null,
                    frequency_id: kpi.frequency_id, // required, 1 for weekly, 2 for monthly, 3 for quarterly, 4 for yearly
                    value: kpi.target == null ? (data.value == 'yes' ? 1 : 0) : parseFloat(data.value), // required
                    kpi_id: kpi.id //required
                };
                // console.log("Submitting KPI value:", info);
                const response = await addNewEntry(info);
                // console.log("KPI value submitted successfully:", response);
                toast.success("KPI value added successfully");
                reset(); // Reset the form after submission
                onFormSubmit();
            } catch (exc) {
                // console.log("Error submitting KPI value:", JSON.stringify(exc));
                toast.error(`Failed to add KPI value: ${exc}`);
            }
            setCanSend(true);
        } else {
            toast.warn("Please wait!! Do not spam!")
        }


    }

    return (
        <>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2 overflow-y-auto max-h-[80vh]">
                    <label className='text-lg font-semibold'>
                        Select Year *
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
                                kpi.frequency_id <= 2 &&
                                <>
                                    <label className='text-lg font-semibold'>
                                        Select Month *
                                    </label>
                                    <select
                                        {...register("month", { required: "Month is required" })}
                                        onChange={(e) => setSelectedMonth(e.target.value)}
                                        value={selectedMonth}
                                        className='border-2 border-gray-300 rounded-lg p-2'
                                    >
                                        <option value="" disabled>Select Month</option>

                                        {
                                            months.map((month, index) => (
                                                <option key={index} value={index}>{month.name} {index > 8 ? (parseInt(selectedYear) + 1) : selectedYear}</option>
                                            ))
                                        }
                                    </select>
                                </>
                            }
                            {
                                kpi.frequency_id == 1 &&
                                <>
                                    <label className='text-lg font-semibold'>
                                        Select Week *
                                    </label>
                                    <select
                                        {...register("week", { required: "Week is required" })}
                                        className='border-2 border-gray-300 rounded-lg p-2'
                                    >
                                        <option disabled value="">Select Week</option>
                                        {
                                            dispWeeks
                                                .filter(week => week.start.getMonth() === (months[selectedMonth].canonic))
                                                .map((week, index) => (
                                                    <option key={index} value={JSON.stringify(week)}>
                                                        Week {week.week} ({week.start.toLocaleDateString()} - {week.end.toLocaleDateString()})
                                                    </option>
                                                )
                                                )
                                        }
                                    </select>
                                </>

                            }
                            {
                                kpi.frequency_id == 3 &&

                                <>
                                    <label className='text-lg font-semibold'>
                                        Select Quarter
                                    </label>

                                    <select className='border-2 border-gray-300 rounded-lg p-2'
                                        {...register("quarter", { required: "Quarter is required" })}

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
                    {
                        kpi.target && 
                        <>
                            <p className='text-lg font-semibold'>Target: <span className='text-[#FF0000]'>{kpi.target}</span> </p>
                        </>
                    }   

                    <label className='text-lg font-semibold'>
                        Value achieved *
                    </label>
                    {kpi.target === null ? (
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-4">
                                <label>
                                    <input
                                        type="radio"
                                        value="yes"
                                        {...register("value", { required: "Please select Yes or No" })}
                                    /> Yes
                                </label>
                                <label>
                                    <input
                                        type="radio"
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
                    className='bg-blue-500 text-white rounded-lg p-2 cursor-pointer hover:bg-blue-600 transition-colors'
                />
            </form>
        </>
    )
}

export default AddKPIValueForm;