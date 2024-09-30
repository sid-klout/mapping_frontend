import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";

// Define modal styles
const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
    },
};

const ViewExcel = () => {
    const [premiumData, setPremiumData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); // Default items per page
    const [itemsOptions] = useState([10, 25, 50, 100]); // Options for items per page
    const [searchQuery, setSearchQuery] = useState(""); // Search query
    const [searchColumn, setSearchColumn] = useState("first_name"); // Default search column

    // For modal and editing
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentEditData, setCurrentEditData] = useState({});

    const customStyles = {
        content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "80%", // Increased width
            maxWidth: "1000px", // Max width limit
        },
    };

    const fetchPremiumData = async () => {
        try {
            const response = await axios.get("https://app.klout.club/api/mapping/v1/premium-data/all"); // Replace with actual API
            const data = response.data.data;
            setPremiumData(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchPremiumData();
    }, []);

    // Calculate the indexes for the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = premiumData
        .filter(item =>
            item[searchColumn]?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(indexOfFirstItem, indexOfLastItem);

    // Calculate total pages
    const totalPages = Math.ceil(
        premiumData.filter(item =>
            item[searchColumn]?.toLowerCase().includes(searchQuery.toLowerCase())
        ).length / itemsPerPage
    );

    // Pagination handlers
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(Number(event.target.value));
        setCurrentPage(1); // Reset to first page when items per page changes
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1); // Reset to first page when search query changes
    };

    const handleSearchColumnChange = (event) => {
        setSearchColumn(event.target.value);
        setSearchQuery(""); // Clear search query when changing columns
        setCurrentPage(1); // Reset to first page when search column changes
    };

    const renderPageNumbers = () => {
        let pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }

        const start = Math.max(1, currentPage - 2);
        const end = Math.min(totalPages, currentPage + 2);
        return pageNumbers.slice(start - 1, end);
    };

    // Handle edit button click
    const openEditModal = (item) => {
        setCurrentEditData(item); // Set the current data to edit
        setModalIsOpen(true); // Open modal
    };

    const closeModal = () => {
        setModalIsOpen(false); // Close modal
        setCurrentEditData({}); // Clear edit data
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCurrentEditData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSaveChanges = async () => {
        console.log(currentEditData)
        try {
            // Send API request to update the data
            await axios.patch(`https://app.klout.club/api/mapping/v1/premium-data/update`, {...currentEditData, id: currentEditData._id}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            // Fetch the updated data
            fetchPremiumData();
            closeModal();
        } catch (error) {
            console.error("Error updating data:", error);
        }
    };

    return (
        <div>
            <div className="row">
                <div
                    className="col-12"
                    style={{
                        backgroundColor: "#fff",
                        padding: "10px 20px",
                        borderRadius: "10px",
                    }}
                >
                    <div className="d-sm-flex align-items-center justify-content-between mb-4">
                        <h1 className="h3 mb-0 text-gray-800">All Data</h1>
                        <Link
                            to={`/admin/dashboard`}
                            className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
                            style={{
                                backgroundColor: "#F5007E",
                                borderColor: "#F5007E",
                                color: "white",
                                borderRadius: "12px",
                            }}
                        >
                            <i className="fa fa-solid fa-arrow-left"></i> &nbsp; Go Back
                        </Link>
                    </div>
                </div>
            </div>

            <div className="row p-3">
                <div className="card shadow mb-4">
                    <div className="card-header py-3">
                        <h6 className="m-0 font-weight-bold text-primary">Saved Data</h6>
                    </div>
                    <div className="card-body">
                        <div className="row mb-3">
                            <div className="col-md-3" style={{ display: 'flex', alignItems: 'center' }}>
                                <label htmlFor="itemsPerPage" style={{ flex: "1" }}><strong>Items per page:</strong></label>
                                <select
                                    id="itemsPerPage"
                                    className="form-control"
                                    style={{ flex: "1" }}
                                    value={itemsPerPage}
                                    onChange={handleItemsPerPageChange}
                                >
                                    {itemsOptions.map(option => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-4" style={{ display: 'flex', alignItems: 'center' }}>
                                <label htmlFor="searchColumn" style={{ flex: "1" }} className="ms-3"><strong>Search Column:</strong></label>
                                <select
                                    id="searchColumn"
                                    className="form-control"
                                    style={{ flex: "1" }}
                                    value={searchColumn}
                                    onChange={handleSearchColumnChange}
                                >
                                    {/* Add your search column options here */}
                                    <option value="first_name">First Name</option>
                                    <option value="last_name">Last Name</option>
                                    <option value="job_title">Job Title</option>
                                    <option value="company_name">Company Name</option>
                                    <option value="industry">Industry</option>
                                    <option value="email">Email</option>
                                    <option value="phone_number">Phone Number</option>
                                    <option value="alternate_mobile_number">Alternate Mobile Number</option>
                                    <option value="website">Website</option>
                                    <option value="employee_size">Employee Size</option>
                                    <option value="company_turn_over">Company Turn Over</option>
                                    <option value="linkedin_page_link">Linkedin Page Link</option>
                                    <option value="country">Country</option>
                                    <option value="job_function">Job Function</option>
                                    
                                </select>
                            </div>
                            <div className="col-md-4 mt-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={`Search by ${searchColumn.replace('_', ' ')}`}
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                            </div>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table className="table table-striped table-bordered">
                                <thead>
                                    <tr>
                                        <th>first_name</th>
                                        <th>last_name</th>
                                        <th>job_title</th>
                                        <th>company_name</th>
                                        <th>industry</th>
                                        <th>email</th>
                                        <th>phone_number</th>
                                        <th>alternate_mobile_number</th>
                                        <th>website</th>
                                        <th>employee_size</th>
                                        <th>company_turn_over</th>
                                        <th>linkedin_page_link</th>
                                        <th>country</th>
                                        <th>job_function</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((item, index) => (
                                        <tr key={index}>
                                            <td style={{ whiteSpace: 'nowrap' }}>{item.first_name || ""}</td>
                                            <td style={{ whiteSpace: 'nowrap' }}>{item.last_name || ""}</td>
                                            <td style={{ whiteSpace: 'nowrap' }}>{item.job_title || ""}</td>
                                            <td style={{ whiteSpace: 'nowrap' }}>{item.company_name || ""}</td>
                                            <td style={{ whiteSpace: 'nowrap' }}>{item.industry || ""}</td>
                                            <td style={{ whiteSpace: 'nowrap' }}>{item.email || ""}</td>
                                            <td style={{ whiteSpace: 'nowrap' }}>{item.phone_number || ""}</td>
                                            <td style={{ whiteSpace: 'nowrap' }}>{item.alternate_mobile_number || ""}</td>
                                            <td style={{ whiteSpace: 'nowrap' }}>{item.website || ""}</td>
                                            <td style={{ whiteSpace: 'nowrap' }}>{item.employee_size || ""}</td>
                                            <td style={{ whiteSpace: 'nowrap' }}>{item.company_turn_over || ""}</td>
                                            <td style={{ whiteSpace: 'nowrap' }}>{item.linkedin_page_link || ""}</td>
                                            <td style={{ whiteSpace: 'nowrap' }}>{item.country || ""}</td>
                                            <td style={{ whiteSpace: 'nowrap' }}>{item.job_function || ""}</td>
                                            <td>
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => openEditModal(item)}
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <nav aria-label="Page navigation" style={{ marginTop: '20px' }}>
                            <ul className="pagination justify-content-center">
                                <li className="page-item">
                                    <button
                                        className="page-link"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </button>
                                </li>
                                {renderPageNumbers().map(number => (
                                    <li
                                        key={number}
                                        className={`page-item ${number === currentPage ? 'active' : ''}`}
                                    >
                                        <button
                                            className="page-link"
                                            onClick={() => handlePageChange(number)}
                                        >
                                            {number}
                                        </button>
                                    </li>
                                ))}
                                <li className="page-item">
                                    <button
                                        className="page-link"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </button>
                                </li>
                            </ul>
                        </nav>

                        {/* Modal for editing data */}
                        <Modal
                            isOpen={modalIsOpen}
                            onRequestClose={closeModal}
                            style={customStyles}
                            contentLabel="Edit Data"

                        >
                            <h2>Edit Data</h2>
                            <form>
                                <div className="row">
                                    <div className="form-group col-3">
                                        <label>First Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="first_name"
                                            value={currentEditData.first_name || ""}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="form-group col-3">
                                        <label>Last Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="last_name"
                                            value={currentEditData.last_name || ""}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="form-group col-3">
                                        <label>Job Title</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="job_title"
                                            value={currentEditData.job_title || ""}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="form-group col-3">
                                        <label>Company Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="company_name"
                                            value={currentEditData.company_name || ""}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="form-group col-3">
                                        <label>Industry</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="industry"
                                            value={currentEditData.industry || ""}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="form-group col-3">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            value={currentEditData.email || ""}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="form-group col-3">
                                        <label>Phone Number</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="phone_number"
                                            value={currentEditData.phone_number || ""}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="form-group col-3">
                                        <label>Alternate Mobile Number</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="alternate_mobile_number"
                                            value={currentEditData.alternate_mobile_number || ""}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="form-group col-3">
                                        <label>Website</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="website"
                                            value={currentEditData.website || ""}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="form-group col-3">
                                        <label>Employee Size</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="employee_size"
                                            value={currentEditData.employee_size || ""}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="form-group col-3">
                                        <label>Company Turnover</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="company_turn_over"
                                            value={currentEditData.company_turn_over || ""}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="form-group col-3">
                                        <label>LinkedIn Page Link</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="linkedin_page_link"
                                            value={currentEditData.linkedin_page_link || ""}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="form-group col-3">
                                        <label>Country</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="country"
                                            value={currentEditData.country || ""}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="form-group col-3">
                                        <label>Job Function</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="job_function"
                                            value={currentEditData.job_function || ""}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="btn btn-primary mt-3"
                                    onClick={handleSaveChanges}
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary mt-3 ms-3"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>
                            </form>
                        </Modal>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewExcel;
