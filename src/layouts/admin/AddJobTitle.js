import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";
import { useHistory, Link } from "react-router-dom";

import loadingGif from "../../assets/images/load.gif";
import Defaultuser from "../../assets/images/defaultuser.png";

function AddJobTitle() {
  const history = useHistory();

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [showAlert, setShowAlert] = useState(true);


  const [formInput, setFormInput] = useState({
    job_title_name: "",
  });

  const handleInput = (e) => {
    e.persist();
    const { name, value } = e.target;
    setFormInput({ ...formInput, [name]: value });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    const fieldErrors = {};

    switch (name) {
      case "job_title_name":
        if (value === "") {
          fieldErrors[name] = "Job Title is required.";
        } else if (!/^[a-zA-Z\s]*$/.test(value)) {
          fieldErrors[name] =
            "Job Title should only contain alphabets and spaces.";
        } else if (value.length > 30) {
          fieldErrors[name] = "Maximum 30 Characters Allowed.";
        }
        break;

      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      ...fieldErrors,
    }));
  };

  const handleInputFocus = (e) => {
    const { name, value } = e.target;
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    setFormInput((prevValidFields) => ({ ...prevValidFields, [name]: value }));
    e.target.classList.remove("is-invalid");
  };

  const closeAlert = () => {
    setShowAlert(false);
  };

  //Add Company Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const fieldErrors = {};

    if (
      !formInput.job_title_name === "" ||
      /^\s*$/.test(formInput.job_title_name) ||
      formInput.job_title_name.length === 0
    ) {
      fieldErrors.job_title_name = "Job Title Name is required.";
    } else if (!/^[a-zA-Z\s]*$/.test(formInput.job_title_name)) {
      fieldErrors.job_title_name =
        "Job Title Name should only contain alphabets and spaces.";
    }

    if (Object.keys(fieldErrors).length === 0) {
      setIsLoading(true);

      const formData = new FormData();

      formData.append("job_title_name", formInput.job_title_name);

      axios
        .post(`/api/job_title`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          if (res.data.status === 200) {
            swal("Success", res.data.message, "success");

            setFormInput({
              ...formInput,
              job_title_name: "",
            });

            setErrors({});
          } else if (res.data.status === 422) {
            setErrors(res.data.errors);
          } else if (res.data.status === 400) {
            swal("All fields are mandatory", "", "error");
          }
        });
    } else {
      setErrors(fieldErrors);
    }
    setIsLoading(false);
  };

  return (
    <>
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
            <h1 className="h3 mb-0 text-gray-800">Add Job Title</h1>
          </div>
        </div>
      </div>

      <div className="row p-3">
        {/* <div className="col-md-12"> */}
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">Add Job Title</h6>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-12 col-lg-12">
                {/* <h5 className="text-center">Add Job Title Details</h5>
                <hr /> */}
                <form
                  className="user"
                  onSubmit={handleSubmit}
                  encType="multipart/form-data"
                >
                  {/* Company Details  */}
                  <div className="form-group row">
                    {/* Company Name */}
                    <div className="col-4">
                      <label forhtml="job_title_name">Job Title Name</label>

                      <input
                        type="text"
                        className={`form-control ${
                          errors.job_title_name ? "is-invalid" : ""
                        }`}
                        placeholder="Job Title"
                        name="job_title_name"
                        maxLength={8}
                        value={formInput.job_title_name}
                        onChange={handleInput}
                        onBlur={handleBlur}
                        onFocus={handleInputFocus}
                      />

                      {errors.job_title_name && (
                        <div
                          className="invalid-feedback"
                          style={{
                            textAlign: "left",
                          }}
                        >
                          {errors.job_title_name}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-group row">
                    <label
                      forhtml="status"
                      className="col-12 col-form-label"
                    ></label>

                    <div className="col-12 mb-3 mb-sm-0">
                      <button
                        className="btn btn-primary btn-user"
                        style={{
                          backgroundColor: "#F5007E",
                          borderColor: "#F5007E",
                          fontSize: "14px",
                          padding: "1% 6%",
                        }}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <img
                              src={loadingGif}
                              alt="Loading..."
                              style={{ width: "20px", height: "20px" }}
                            />
                          </>
                        ) : (
                          "Submit"
                        )}
                      </button>
                      <hr />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddJobTitle;
