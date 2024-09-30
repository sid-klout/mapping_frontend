import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import './custom.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function Notification(props) {
    const [data, setData] = useState([]);
    const [tempData, setTempData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 25;
    const [selectedTemplate, setSelectedTemplate] = useState('send_request');
    const [activeCard, setActiveCard] = useState('total_requests');
    const [totalRequest, setTotalRequest] = useState(0);
    const [totalSeenRequest, setTotalSeenRequest] = useState(0);
    const [totalUnseenRequest, setTotalUnseenRequest] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        handleSendRequest(); 
    }, []);

    const handleSendRequest = () => {
        axios.get('https://app.klout.club/api/mapping/v1/notification-report/send-connection-request').then((res) => {
            if (res.data.status) {
                setData(res.data.data);
                setTempData(res.data.data);
                setTotalRequest(res.data.data.length);
                const seenData = res.data.data.filter(item => item.isRead === 1);
                const unseenData = res.data.data.filter(item => item.isRead === 0);
                setTotalSeenRequest(seenData.length);
                setTotalUnseenRequest(unseenData.length);
            }
        });
    };

    const handleAcceptRequest = () => {
        axios.get('https://app.klout.club/api/mapping/v1/notification-report/accept-connection-request').then((res) => {
            if (res.data.status) {
                setData(res.data.data);
                setTempData(res.data.data);
                setTotalRequest(res.data.data.length);
                const seenData = res.data.data.filter(item => item.isRead === 1);
                const unseenData = res.data.data.filter(item => item.isRead === 0);
                setTotalSeenRequest(seenData.length);
                setTotalUnseenRequest(unseenData.length);
            }
        });
    };

    const handleProfileView = () => {
        axios.get('https://app.klout.club/api/mapping/v1/notification-report/profile-view').then((res) => {
            if (res.data.status) {
                setData(res.data.data);
                setTempData(res.data.data);
                setTotalRequest(res.data.data.length);
                const seenData = res.data.data.filter(item => item.isRead === 1);
                const unseenData = res.data.data.filter(item => item.isRead === 0);
                setTotalSeenRequest(seenData.length);
                setTotalUnseenRequest(unseenData.length);
            }
        });
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const handleCardClick = (card) => {
        setCurrentPage(1);
        let newData = [];

        if (card === 'total_requests') {
            newData = tempData;
        } else if (card === 'total_request_seen') {
            newData = tempData.filter(item => item.isRead === 1);
        } else if (card === 'total_request_unseen') {
            newData = tempData.filter(item => item.isRead === 0);
        }

        setData(newData);
        setActiveCard(card);
    };

    const normalDateFormat = (date) => {
        const newDate = new Date(date);
        return newDate.toLocaleString();
    };

    const handleDateFilter = () => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            const filteredData = tempData.filter((item) => {
                const itemDate = new Date(item.createdAt);
                return itemDate >= start && itemDate <= end;
            });

            setData(filteredData);
            setCurrentPage(1); 
        } else {
            alert("Please select both start and end dates.");
        }
    };

    const resetFilter = () => {
        setStartDate('');
        setEndDate('');
        setData(tempData); 
        setCurrentPage(1); 
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const maxPageNumbers = 5;
    const pageNumbers = [];

    const startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2));
    const endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="container">
            <h2 className="my-4">Notification Report</h2>

            <div className="mb-4">
                <div className="btn-group">
                    <button
                        className={`btn ${selectedTemplate === 'send_request' ? 'btn-active' : 'btn-outline-primary'}`}
                        onClick={() => { setSelectedTemplate('send_request'); setCurrentPage(1); setActiveCard('total_requests'); handleSendRequest(); }}
                    >
                        Send Connection Request
                    </button>
                    <button
                        className={`btn ${selectedTemplate === 'accept_request' ? 'btn-active' : 'btn-outline-primary'}`}
                        onClick={() => { setSelectedTemplate('accept_request'); setCurrentPage(1); setActiveCard('total_requests'); handleAcceptRequest(); }}
                    >
                        Accept Connection Request
                    </button>
                    <button
                        className={`btn ${selectedTemplate === 'profile_view' ? 'btn-active' : 'btn-outline-primary'}`}
                        onClick={() => { setSelectedTemplate('profile_view'); setCurrentPage(1); setActiveCard('total_requests'); handleProfileView(); }}
                    >
                        Profile View
                    </button>
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-md-4 mb-3">
                    <div className={`card border-primary clickable-card ${activeCard === 'total_requests' ? 'card-active' : ''}`} onClick={() => handleCardClick('total_requests')}>
                        <div className="card-body text-center">
                            <h5 className="card-title">Total Sent Notification</h5>
                            <p className="card-text display-4">{totalRequest}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-3">
                    <div className={`card border-success clickable-card ${activeCard === 'total_request_seen' ? 'card-active' : ''}`} onClick={() => handleCardClick('total_request_seen')}>
                        <div className="card-body text-center">
                            <h5 className="card-title">Total Read Notifications</h5>
                            <p className="card-text display-4">{totalSeenRequest}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-3">
                    <div className={`card border-info clickable-card ${activeCard === 'total_request_unseen' ? 'card-active' : ''}`} onClick={() => handleCardClick('total_request_unseen')}>
                        <div className="card-body text-center">
                            <h5 className="card-title">Total Unread Notifications</h5>
                            <p className="card-text display-4">{totalUnseenRequest}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-md-4">
                    <label>Start Date</label>
                    <input
                        type="date"
                        className="form-control"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                <div className="col-md-4">
                    <label>End Date</label>
                    <input
                        type="date"
                        className="form-control"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                <div className="col-md-4">
                    <button className="btn btn-primary mt-4" onClick={handleDateFilter}>Filter by Date</button>
                    <button className="btn btn-secondary mt-4 ml-2" onClick={resetFilter}>Reset Filter</button>
                </div>
            </div>

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Receiver Name</th>
                        <th>Body</th>
                        <th>Message Status</th>
                        <th>Send Date</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((item, index) => (
                        <tr key={item._id}>
                            <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                            <td>{capitalizeFirstLetter(item.user_id.first_name) + ' ' + capitalizeFirstLetter(item.user_id.last_name)}</td>
                            <td>{capitalizeFirstLetter(item.title) + item.body}</td>
                            <td>{item.isRead === 1 ? "Seen" : "Unseen"}</td>
                            <td>{normalDateFormat(item.createdAt)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <nav aria-label="Page navigation">
                <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={goToPreviousPage}>
                            <FaChevronLeft />
                        </button>
                    </li>
                    {pageNumbers.map((page) => (
                        <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => paginate(page)}>{page}</button>
                        </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={goToNextPage}>
                            <FaChevronRight />
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Notification;

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
