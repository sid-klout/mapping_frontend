import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ViewExcel = () => {
    const [premiumData, setPremiumData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); // Default items per page
    const [itemsOptions] = useState([10, 25, 50, 100]); // Options for items per page
    const [searchQuery, setSearchQuery] = useState(""); // Search query
    const [searchColumn, setSearchColumn] = useState("first_name"); // Default search column

    const fetchPremiumData = async () => {
        try {
            const response = await axios.get("https://app.klout.club/api/mapping/v1/premium-data/all");
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

        // Display page numbers with a limited range
        const start = Math.max(1, currentPage - 2);
        const end = Math.min(totalPages, currentPage + 2);
        return pageNumbers.slice(start - 1, end);
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
                                    <option value="linkedin_page_link">LinkedIn Page Link</option>
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
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Controls */}
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewExcel;
