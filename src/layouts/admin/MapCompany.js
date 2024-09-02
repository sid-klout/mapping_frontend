import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
import './mapCompany.css';

function MapCompany2() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [nameFilter, setNameFilter] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const searchBoxRefs = useRef({});
  const [addUnmappedCompany, setAddUnmappedCompany] = useState("")

  useEffect(() => {
    axios.get("https://app.klout.club/api/mapping/v1/company-master/get-unmapped-company").then((res) => {
      if (res.data.status) {
        setData(res.data.data);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const filtered = data.filter((d) =>
      d.company.toLowerCase().includes(nameFilter.toLowerCase())
    );
    setFilteredData(filtered);
  }, [nameFilter, data]);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage);
  };

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = async (e, rowId) => {
    const query = e.target.value;

    if (query.trim().length > 0) {
      const response = await axios.get(`https://app.klout.club/api/mapping/v1/company-master/all-company?page=&1&search=${query}`);
      const searchResults = response.data.data.companies;

      setFilteredData((prevData) =>
        prevData.map((row) =>
          row._id === rowId ? { ...row, searchResults, searchQuery: query } : row
        )
      );
    } else {
      setFilteredData((prevData) =>
        prevData.map((row) =>
          row._id === rowId ? { ...row, searchResults: [], searchQuery: "", selectedOption: null } : row
        )
      );
    }
  };

  const handleSelect = (option, rowId) => {
    setFilteredData((prevData) =>
      prevData.map((row) =>
        row._id === rowId ? { ...row, selectedOption: option.company, searchResults: [], searchQuery: option.company } : row
      )
      
    );
  };

  const handleClickOutside = (rowId) => {
    const row = filteredData.find((row) => row._id === rowId);
    if (!row.searchQuery) {
      setFilteredData((prevData) =>
        prevData.map((row) =>
          row._id === rowId ? { ...row, selectedOption: null } : row
        )
      );
    }
  };

  const handleMapped = (unmappedCompany, mappedCompany) => {
    Swal.fire({
        title: "Are you sure?",
        text: `You mapped ${unmappedCompany} with ${mappedCompany}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#00ff00",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .post(`https://app.klout.club/api/mapping/v1/company-master/mapping-unmapped-company`,
                { unmappedCompany,  mappedCompany}, 
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
            .then(function (res) {
              Swal.fire({
                icon: "success",
                title: res.data.message,
                showConfirmButton: false,
                timer: 3000,
              });
              window.location.reload()
            })
            .catch(function (error) {
              Swal.fire({
                icon: "error",
                title: "An Error Occured!",
                showConfirmButton: false,
                timer: 1500,
              });
            });
        }
      });
    
  }

  const handleDelete = (e, id) => {
    e.preventDefault();
    const thisClicked = e.currentTarget;

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`https://app.klout.club/api/mapping/v1/company-master/delete-unmapped-company/${id}`)
          .then(function (res) {
            Swal.fire({
              icon: "success",
              title: res.data.message,
              showConfirmButton: false,
              timer: 1500,
            });
            thisClicked.closest("tr").remove();
          })
          .catch(function (error) {
            Swal.fire({
              icon: "error",
              title: "An Error Occured!",
              showConfirmButton: false,
              timer: 1500,
            });
          });
      }
    });
  };

  const handleAddUnmappedCompany = (e) => {
    e.preventDefault();

    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to add ${addUnmappedCompany} to Unmapped Company List`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, add it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(`https://app.klout.club/api/mapping/v1/company-master/add-unmapped-country`, 
            {
            company: addUnmappedCompany,
            isMapped: false,
            mappedWith: ""
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(function (res) {
            Swal.fire({
              icon: "success",
              title: res.data.message,
              showConfirmButton: false,
              timer: 1500,
            });
            window.location.reload();
          })
          .catch(function (error) {
            Swal.fire({
              icon: "error",
              title: "An Error Occured!",
              showConfirmButton: false,
              timer: 1500,
            });
          });
      }
    });
  }

  let dataList = "";

  if (loading) {
    return <h6>Loading...</h6>;
  } else {
    dataList = paginatedData.map((row,index) => (
      <tr key={row._id}>
        <td style={{ padding: "14px 4px" }}>{row.company}</td>
        <td>
          <input
            type="text"
            placeholder="Search"
            className="form-control"
            value={row.searchQuery || ""}
            onChange={(e) => handleSearch(e, row._id)}
            ref={(el) => (searchBoxRefs.current[row._id] = el)}
            onBlur={() => handleClickOutside(row._id)}
          />
          {row.searchResults && row.searchResults.length > 0 && (
            <ul className="search-results">
              {row.searchResults.map((result) => (
                <li key={result._id} onClick={() => handleSelect(result, row._id)}>
                  {result.company}
                </li>
              ))}
            </ul>
          )}
        </td>
        <td>
          <button className="btn btn-primary" disabled={!row.selectedOption} onClick={() => {handleMapped(row.company, filteredData[index].selectedOption)}}>
            Mapped
          </button>
          &nbsp; &nbsp;
        <button
              data-toggle="tooltip"
              data-placement="bottom"
              title="Delete Industry"
              className="btn btn-sm btn-danger btn-circle mt-2"
              onClick={(e) => handleDelete(e, row._id)}
              style={{ borderRadius: "50%" }}
            >
              <i class="fas fa-trash"></i>
            </button>
        </td>
       
      </tr>
    ));
  }

  return (
    <>
      <div className="d-sm-flex align-items-center justify-content-between m-4">
        <h1 className="h3 mb-0 text-gray-800">All Unmapped Companies</h1>
      </div>


      <div className="row p-3">
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">Add Unmapped Company</h6>
          </div>

          <div className="card-body">
            <div className="row pb-4">
              <div className="col-6">
                <input
                  type="text"
                  value={addUnmappedCompany}
                  placeholder="Filter by Company"
                  onChange={(e) => setAddUnmappedCompany(e.target.value)}
                  className="form-control"
                />
                <button className="btn btn-success" onClick={handleAddUnmappedCompany} disabled={!addUnmappedCompany.length > 0}>Add</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row p-3">
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">All Unmapped Companies</h6>
          </div>

          <div className="card-body">
            <div className="row pb-4">
              <div className="col-3">
                <label htmlFor="Company">Company Name</label>
                <input
                  type="text"
                  placeholder="Filter by Company"
                  value={nameFilter}
                  className="form-control"
                  onChange={(e) => setNameFilter(e.target.value)}
                />
              </div>
            </div>

            <div className="table-responsive">
              <table className="table" width="100%" cellspacing="4">
                <thead>
                  <tr>
                    <th>Unmapped Company</th>
                    <th>Mapped With</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {dataList.length > 0 ? (
                    dataList
                  ) : (
                    <tr>
                      <td className="text-center" colSpan={7}>
                        No Data Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              <nav aria-label="Page navigation comments" className="mt-4">
                {filteredData.length > 0 && (
                  <ReactPaginate
                    previousLabel="<< Previous"
                    nextLabel="Next >>"
                    breakLabel="..."
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    pageRangeDisplayed={4}
                    marginPagesDisplayed={2}
                    pageCount={Math.ceil(filteredData.length / itemsPerPage)}
                    onPageChange={({ selected }) => handlePageChange(selected + 1)}
                    containerClassName="pagination"
                    activeClassName="active"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                  />
                )}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MapCompany2;
