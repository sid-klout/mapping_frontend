import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useHistory, Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { Button } from "bootstrap";

function ViewUserDetails(props) {
  const history = useHistory();

  const userId = props.match.params.id;

  const [loading, setLoading] = useState(true);

  const [data, setData] = useState([]);

  const itemsPerPage = 10;

  useEffect(() => {
    axios
      .get(`https://app.klout.club/api/v1/user/adminViewUserDetails/${userId}`)
      .then((res) => {
        console.log(res.data.result);

        if (res.data.status) {
          setData(res.data.result);
        }

        setLoading(false);
      });
  }, []);

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
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`/api/block-user/${id}`)
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
          .delete(`/api/delete-user/${id}`)
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

  let dataList = "";

  if (loading) {
    return <h6>Loading...</h6>;
  } else {
  }

  return (
    <>
      <div className="d-sm-flex align-items-center justify-content-between m-4">
        <h1 className="h3 mb-0 text-gray-800">User Details</h1>

        <Link
          to="/admin/view-all-users"
          className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
          style={{
            backgroundColor: "#F5007E",
            borderColor: "#F5007E",
            color: "white",
            borderRadius: "12px",
          }}
        >
          <i className="fa fa-arrow-left fa-sm mx-1"></i> Back to All Users
        </Link>
      </div>

      <div className="row p-3">
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">User Details</h6>
          </div>

          <div className="card-body">
            <div className="row pb-4">
              <div className="col-12">
                <p>
                  Name: {data.first_name} {data.last_name}
                </p>
                <p>Mobile Number : {data.mobileNumber} </p>
                <p>Company : {data.company} </p>
                <p>City : {data.city} </p>
                <p>Designation : {data.designation} </p>
                <p>Industry : {data.industryName} </p>
                <p>Latitude : {data.latitude} </p>
                <p>Longitude : {data.longitude} </p>
                <p>{data.status == "0" && "Status : Blocked"}</p>
                <p> {data.status == "1" && "Status : Deleted"}</p>
                <p>
                  {" "}
                  {(data.status != "1" || data.status !== "0") &&
                    ("Status : Active")
                    }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewUserDetails;
