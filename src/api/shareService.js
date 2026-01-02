import {carServiceApi} from "./axiosClient.js";


const ShareService = {

    generateShareToken: async ({vehicleId}) => {
        const response = await carServiceApi.post(`/share/vehicle/${vehicleId}`, {"expire_in_days" :350 ,
        "include_details": ["images"] });
        return response.data;
    },

    getPublicVehicleData: async ({shareToken}) => {
        const response = await carServiceApi.get(`/share/vehicle/public/${shareToken}`);
        return response.data;
    }

}

export default ShareService;