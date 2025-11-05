import axios from "axios"

const backendURL = import.meta.env.VITE_BACKEND_URL;


export const loginUser = async (payload: { email: string; password: string; role: string; }) => {

    const res = await axios.post(backendURL + '/api/auth/login', payload);

    return res.data;
}


export const registerUser = async (formData: any) => {


    const response = await axios.post(backendURL + "/api/auth/signup", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data; // Return backend response
};


// Fetch NGOs
export const getAllNGOs = async () => {

    const token = localStorage.getItem('token');

    const res = await axios.get(backendURL + '/api/auth/getAllNGOs', {
        headers: {
            Authorization: `Bearer ${token}`,

        },
    })

    return res.data.ngos || [];

}

// User Dashboard
export const createDonation = async (formData: any) => {

    const token = localStorage.getItem('token');
    const { data } = await axios.post(backendURL + '/api/donations/', formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        },
    })

    return data;

}

// User Dashboard
export const fetchUserDonations = async (userId: string) => {

    if (!userId) return [];

    const token = localStorage.getItem("token");

    try {
        const res = await axios.get(backendURL + `/api/donations/user/${userId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return res.data.donations || [];
    } catch (error) {
        console.error("Error fetching user donations:", error);
        return [];
    }

}

// NGO Dashboard
export const fetchNGODonations = async (ngoId: string) => {
    const token = localStorage.getItem("token");
    const res = await axios.get(backendURL + `/api/donations/ngo/${ngoId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data.donations || [];
};

// NGO Dashboard
export const updateDonationStatus = async (id: string, status: string) => {
    const token = localStorage.getItem('token');
    const res = await axios.put(
        backendURL + `/api/donations/${id}/status`,
        { status },
        {
            headers: { Authorization: `Bearer ${token}` }
        },
    );
    return res.data;
};


// NGO: Configure accepted items
export const configureNGO = async (acceptedItems: string[]) => {
    const token = localStorage.getItem('token');
    const res = await axios.post(
        backendURL + '/api/auth/configure',
        { acceptedItems },
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );
    return res.data; // { success, message, user }
}




