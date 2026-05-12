import { useEffect, useState } from 'react'
import CardPassword from '../components/profile/CardPassword'
import { CardProfile } from '../components/profile/CardProfile'
import FormProfile from '../components/profile/FormProfile'
import { useFetch } from '../hooks/useFetch'
import { API_BASE_URL, getAuthHeaders, getStoredSession } from '../utils/auth'
import Navbar from "../components/Navbar"; 
const Profile = () => {
    const fetchDataBackend = useFetch()
    const [profile, setProfile] = useState(() => getStoredSession())

    useEffect(() => {
        const loadProfile = async () => {
            const url = `${API_BASE_URL}/auth/perfil`
            const response = await fetchDataBackend(url, null, "GET", getAuthHeaders())
            if (response) {
                setProfile((currentProfile) => ({
                    ...currentProfile,
                    ...response
                }))
            }
        }

        loadProfile()
    }, [fetchDataBackend])

    return (
        <>
            <div>
                <h1 className='font-black text-4xl text-gray-500'>Perfil</h1>
                <hr className='x'/>
                <p className='mb-8'>Este modulo te permite gestionar el perfil del usuario.</p>
            </div>

            <div className='flex justify-around gap-x-8 flex-wrap gap-y-8 md:flex-nowrap'>
                <div className='w-full md:w-1/2'>
                    <FormProfile profile={profile} onProfileUpdated={setProfile}/>
                </div>
                <div className='w-full md:w-1/2'>
                    <CardProfile profile={profile}/>
                    <CardPassword/>
                </div>
            </div>
        </>
    )
}

export default Profile
