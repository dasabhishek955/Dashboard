import React, { useState } from 'react';
import axios from 'axios';
import './UploadDataForm.css';
import { useNavigate } from 'react-router-dom'



const UploadDataForm = () => {
    let navigate = useNavigate();

    const [formData, setFormData] = useState({
        Item_ID: '',
        name: '',
        date: '',
        weight: '',
        cost: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5004/upload-data', formData);
            setFormData({
                Item_ID: '',
                name: '',
                weight: '',
                cost: '',
            });
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };

    const handleNavigate = () => {
        navigate("/dashboard");
    }

    return (
        <>
            <div className="upload-data-form-container">
                <div className='title'>Upload Data</div>
                <form onSubmit={handleSubmit} className="upload-form">
                    <div className="form-group">
                        <input type="number" name="Item_ID" value={formData.id} onChange={handleChange} placeholder="Enter ID" />
                    </div>
                    <div className="form-group">
                        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter Name" />
                    </div>
                    <div className="form-group">
                        <input type="date" name="date" value={formData.date} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <input type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder="Enter weights (in KGs) " />
                    </div>
                    <div className="form-group">
                        <input type="number" name="cost" value={formData.cost} onChange={handleChange} placeholder="Enter cost (in $) " />
                    </div>
                    <button type="submit" className="submit-button">
                        Submit
                    </button>
                </form>
            </div>
            <div className='navigation-area'>
                <button type="button" className="navigation-botton" onClick={handleNavigate}>
                    Go To Dashboard
                </button>
            </div>
        </>

    );
};

export default UploadDataForm;
