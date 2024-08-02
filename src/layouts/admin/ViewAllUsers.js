import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { Button } from "bootstrap";

function ViewAllUsers() {
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState([]);
  //   const [search, setSearch] = useState("");
  //   const [nameFilter, setNameFilter] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  useEffect(() => {
    axios.get("https://app.klout.club/api/v1/user/getAllUsers").then((res) => {
      // console.log(res.data.result.data);

      if (res.data.status) {
        setData(res.data.result.data);
        setFilteredData(res.data.result.data);
      }

      setLoading(false);
    });
  }, []);

  useEffect(() => {
    // const filtered = data.filter((d) => {
    //   const nameMatch = d.name.toLowerCase().includes(nameFilter.toLowerCase());
    //   return nameMatch;
    // });

    //   const searchFiltered = filtered.filter((d) =>
    //     d.name.toLowerCase().includes(search.toLowerCase())
    //   );

    setFilteredData(filteredData);
  }, [filteredData]);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage);
  };

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const blockRow = (e, id) => {
    e.preventDefault();

    const thisClicked = e.currentTarget;

    Swal.fire({
      title: "Are you want to block this User?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Block it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .get(`https://app.klout.club/api/v1/user/adminBlockUser/${id}`)
          .then(function (res) {
            Swal.fire({
              icon: "success",
              title: res.data.message,
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              setTimeout(() => {
                window.location.reload(); // Refreshes the page after a delay
              }, 300); // Adjust the delay as needed
            });
            // thisClicked.closest("tr").remove();
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

  const deleteRow = (e, id) => {
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
          .get(`https://app.klout.club/api/v1/user/adminDeleteUser/${id}`)
          .then(function (res) {
            Swal.fire({
              icon: "success",
              title: res.data.message,
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              setTimeout(() => {
                window.location.reload(); // Refreshes the page after a delay
              }, 300); // Adjust the delay as needed
            });
            // thisClicked.closest("tr").remove();
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

  let dataList = "";

  if (loading) {
    return <h6>Loading...</h6>;
  } else {
    dataList = paginatedData.map((row) => {
      return (
        <tr key={row._id}>
          <td>{row._id}</td>
          <td>
            {row.first_name} {row.last_name}
          </td>
          <td style={{ padding: "14px 4px" }}>{row.emailId}</td>
          <td style={{ padding: "14px 4px" }}>{row.mobileNumber}</td>
          <td style={{ padding: "14px 4px" }}>{row.company}</td>
          <td style={{ padding: "14px 4px" }}>{row.designation}</td>
          <td style={{ padding: "14px 4px" }}>{row.city}</td>
          <td>
            {/* https://app.klout.club/api/v1/user/adminViewUserDetails */}
            <Link
              to={`view-user-details/${row._id}`}
              data-toggle="tooltip"
              data-placement="bottom"
              title="View State"
              className="btn btn-sm btn-info btn-circle mt-2"
              style={{ borderRadius: "50%", color: "#fff" }}
            >
              <i class="fas fa-eye"></i>
            </Link>
            &nbsp; &nbsp;
            {row.status !== "0" && (
              <>
                <button
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title="Block User"
                  className="btn btn-sm btn-warning btn-circle mt-2"
                  style={{ borderRadius: "50%" }}
                  onClick={(e) => blockRow(e, row._id)}
                >
                  <i class="fas fa-solid fa-user-lock"></i>
                </button>
                &nbsp; &nbsp;
              </>
            )}
            {
              <>
                <button
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title="Delete User"
                  className="btn btn-sm btn-danger btn-circle mt-2"
                  onClick={(e) => deleteRow(e, row._id)}
                  style={{ borderRadius: "50%" }}
                >
                  <i class="fas fa-trash"></i>
                </button>
              </>
            }
          </td>
        </tr>
      );
    });
  }

  return (
    <>
      <div className="d-sm-flex align-items-center justify-content-between m-4">
        <h1 className="h3 mb-0 text-gray-800">All Users</h1>

        {/* <Link
          to="/admin/view-all-users"
          className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
          style={{
            backgroundColor: "#F5007E",
            borderColor: "#F5007E",
            color: "white",
            borderRadius: "12px",
          }}
        >
          <i className="fa fa-plus fa-sm mx-1"></i> View All Users
        </Link> */}
      </div>

      <div className="row p-3">
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">All Users</h6>
          </div>

          <div className="card-body">
            <div className="row pb-4">
              <div className="col-3">
                {/* <label forHtml="State">State Name</label>
                <input
                  type="text"
                  placeholder="Filter by State"
                  value={nameFilter}
                  className="form-control"
                  onChange={(e) => setNameFilter(e.target.value)}
                /> */}
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-hover" width="100%" cellspacing="4">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Name</th>
                    <th>Email ID</th>
                    <th>Mobile</th>
                    <th>Company</th>
                    <th>Designation</th>
                    <th>City</th>
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
                    onPageChange={({ selected }) =>
                      handlePageChange(selected + 1)
                    }
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

export default ViewAllUsers;
