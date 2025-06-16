import { useForm } from 'react-hook-form';


function AddKPIValueForm({ empID, kpi }) {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    cosnt [years,setYears] = useS

    return (
        <>
            <div>
                {empID}
            </div>
            <div>
                {JSON.stringify(kpi)}
            </div>

            <form>
                <select>
                    {

                    }
                </select>
            </form>
        </>
    )
}

export default AddKPIValueForm;