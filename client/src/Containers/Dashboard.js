import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css'; // Import your CSS file
import { useNavigate } from 'react-router-dom'
import BarGraph from './BarGraph';
import WaterFallGraph from './WaterFallGraph';



const Dashboard = () => {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('id');
    const [editData, setEditData] = useState(null);
    const [searchDate, setSearchDate] = useState('');
    const [selectedRow, setSelectedRow] = useState(null);
    const [editMode, setEditMode] = useState(false);


    let navigate = useNavigate();
    useEffect(() => {
        // Fetch data from the backend when the component mounts
        fetchData();
    }, [sortOption]);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5004/fetch-data', {
                params: {
                    sort: sortOption,
                    date: searchDate,
                },
            });
            // Sort the data by ID or cost based on the selected option
            const sortedData = response.data.sort((a, b) => a[sortOption] - b[sortOption]);
            setData(sortedData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const formatDateString = (dateString) => {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', options);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    const handleSearchDateChange = (e) => {
        setSearchDate(e.target.value);
    };

    const handleSearchByDate = () => {
        fetchData();
    };

    const handleNavigate = () => {
        navigate("/uploadDataForm");
    }

    const handleDelete = async (id) => {
        try {
            // Assuming your Flask backend is running on http://localhost:5000
            await axios.delete(`http://localhost:5004/delete-data/${id}`);
            fetchData(); // Refetch data after deletion
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    };

    const handleEditChange = (index, field, value) => {
        setData((prevData) => {
            const newData = [...prevData];
            newData[index][field] = value;
            return newData;
        });
    };

    const handleEditSubmit = async (item) => {
        try {
            await axios.put(`http://localhost:5004/edit-data/${item.id}`, item);
            setEditData(null); // Clear edit data after successful update
            setSelectedRow(null); // Clear the selected row after successful update
            setEditMode(false); // Exit edit mode after submitting
            fetchData(); // Refetch data to update the table

        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    const handleCancelEdit = () => {
        setEditData(null); // Close the edit form or modal
        setEditMode(false);
        setSelectedRow(null)

    };

    const getTotalCost = () => {
        return data.reduce((total, item) => total + item.cost, 0);
    };
    const getTotalWeight = () => {
        return data.reduce((total, item) => total + item.weight, 0);
    };

    const filteredData = data.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleRowClick = (index) => {

    };

    const handleEdit = (index) => {
        setSelectedRow(selectedRow === index ? null : index);
        setEditMode(true);


    };
    return (
        <>
            <div className="dashboard-container">
                <h1>Data Dashboard</h1>
                <div className="search-container">
                    <label htmlFor="search">Search by Name:</label>
                    <input
                        type="text"
                        id="search"
                        value={searchTerm}
                        onChange={handleSearch}
                        placeholder="Enter name..."
                    />
                </div>
                <div className="search-date-container">
                    <label htmlFor="searchDate">Search by Date:</label>
                    <input
                        type="date"
                        id="searchDate"
                        value={searchDate}
                        onChange={handleSearchDateChange}
                    />
                    <button onClick={handleSearchByDate}>Search</button>
                </div>
                <div className="sort-container">
                    <label htmlFor="sort">Sort by:</label>
                    <select id="sort" value={sortOption} onChange={handleSortChange}>
                        <option value="id">ID</option>
                        <option value="cost">Cost</option>
                        <option value="weight">Weight</option>
                    </select>
                </div>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Date</th>
                            <th>Weight</th>
                            <th>Cost</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((item, index) => (
                            <React.Fragment key={index}>
                                <tr onClick={() => handleRowClick(index)} className={selectedRow === index ? 'selected-row' : ''}>
                                    <td>{item.id}</td>
                                    <td>{selectedRow === index ? <input type="text" value={item.name} onChange={(e) => handleEditChange(index, 'name', e.target.value)} /> : (item.name)}</td>
                                    <td>{selectedRow === index ? <input type="date" value={item.date} onChange={(e) => handleEditChange(index, 'date', e.target.value)} /> : formatDateString(item.date)}</td>
                                    <td>{selectedRow === index ? <input type="number" value={item.weight} onChange={(e) => handleEditChange(index, 'weight', e.target.value)} /> : item.weight}</td>
                                    <td>{selectedRow === index ? <input type="number" value={item.cost} onChange={(e) => handleEditChange(index, 'cost', e.target.value)} /> : item.cost}</td>
                                    <td>
                                        {selectedRow === index ? (
                                            <>
                                                <button onClick={() => handleEditSubmit(item)} className='Submit-button'>
                                                    <img src='/upload.png' alt='Submit Icon' />
                                                </button>
                                                <button onClick={handleCancelEdit} className='Cancel-button'>
                                                    <img src='/close.png' alt='Close Icon' />
                                                </button>
                                            </>
                                        ) : (
                                            <button onClick={() => handleEdit(index)} className='Edit-button'>
                                                <img src='/edit.png' alt='Edit Icon' />
                                            </button>
                                        )}
                                        <button onClick={() => handleDelete(item.id)} className='Delete-button'>
                                            <img src='/delete.png' alt='Delete Icon' />
                                        </button>
                                    </td>
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>

                </table>
                {editMode ? (
                    <div> </div>
                ) : (
                    <>
                        <div className="total-cost-container">
                            <p>Total Cost: ${getTotalCost()}</p>
                        </div><div className="total-weight-container">
                            <p>Total Weight: {getTotalWeight()}Kg </p>
                        </div><BarGraph data={data} />
                        <WaterFallGraph data={data} />
                    </>
                )}
            </div>
            <div className='navigation-area'>
                <button type="button" className="navigation-botton" onClick={handleNavigate}>
                    Entry new Data
                </button>
            </div>
        </>
    );
};

export default Dashboard;