import { toast } from 'react-toastify';

const Notification = (type, text) => {
    const options = {
        autoClose: 5000,
        closeButton: false,
        position: toast.POSITION.BOTTOM_RIGHT
    };
    toast[type](text, options);
};

export default Notification